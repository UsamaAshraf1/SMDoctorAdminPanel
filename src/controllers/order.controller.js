const { async } = require("@firebase/util");
const { errorResponse } = require("../helpers/error");

// Set up the request payload
const crypto = require("crypto");
let db = require("../models/index");
const { getIDPattern } = require("../services/getPattern");
const sequelize = require("sequelize");
var moment = require("moment");
moment.tz.setDefault("Asia/Dubai");
var { addNotification } = require("../services/notification");

var axios = require("axios");
const { sendEmail } = require("../services/emails");

moment.tz.setDefault("Asia/Karachi");
exports.add = async (req, res) => {
  try {
    // if (req.body.total_price < 80) {
    //   res.status(400).send({
    //     success: false,
    //     message: "order price is below the range",
    //   });
    //   return;
    // }
    let check = await db.order.findOne({
      where: {
        cartCartId: req.body.cartCartId,
      },
      include: { model: db.cart },
    });
    let vat = await db.vat.findOne({ where: { type: "VAT" } });
    if (!check && vat) {
      vat = vat.get({ plain: true });
      let cart = await db.cart.findOne({
        where: {
          cart_id: req.body.cartCartId,
        },
      });
      let counter = await db.order.count();
      let pattern = "ODR00000";
      if (counter == 0 || (counter && cart)) {
        cart = cart.get({ plain: true });
        let payload = req.body;
        let vat_percent = vat.percent;
        payload["orderID"] = getIDPattern(pattern, ++counter);
        payload["vat_percent"] = vat_percent;
        payload["shipment_price"] = cart.vat_shipment;
        payload["vat_shipment"] = cart.vat_shipment - cart.shipment;
        payload["sub_price"] =
          Number(req.body.total_price - cart.vat_shipment) -
          (req.body.pickupPrice || 0) +
          Number(req.body.discount_price || 0.0);
        payload["vat_price"] =
          payload["sub_price"] -
          payload["sub_price"] / (1 + vat_percent / 100) +
          payload.vat_shipment;
        payload["sub_price"] =
          payload["sub_price"] - (payload.vat_price - payload.vat_shipment);
          
        let data = await db.order.create(payload);
        if (data) {
          addNotification(
            data.get({ plain: true }).order_id,
            "New Order",
            "seller"
          );
          addNotification(
            data.get({ plain: true }).order_id,
            "New Order",
            "customer"
          );
          db.order_trails.create({
            orderOrderId: data.get({ plain: true }).order_id,
            status: "Order Added",
          });
          sendEmail(data.get({ plain: true }).order_id);
          let update = await db.cart.update(
            {
              status: "ordered",
            },
            {
              where: {
                cart_id: req.body.cartCartId,
              },
            }
          );
          if (update) {
            let cartProducts = await db.cart.findOne({
              where: {
                cart_id: req.body.cartCartId,
                status: "ordered",
              },
              include: [
                { model: db.cartProduct },
                { model: db.slotReservation },
              ],
            });
            if (cartProducts) {
              let products = cartProducts.get({ plain: true });

              products.cartProducts.map((item) => {
                db.product
                  .findOne({
                    where: {
                      pid: item.productID,
                    },
                  })
                  .then((data) => {
                    let stock = data.get({ plain: true }).stock;
                    db.product
                      .update(
                        {
                          stock: Number(stock) - Number(item.quantity),
                        },
                        {
                          where: {
                            pid: item.productID,
                          },
                        }
                      )
                      .then((response) => {
                        console.log(response);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
              products.slotReservations.map((item) => {
                db.slotReservation.update(
                  {
                    status: "order",
                  },
                  {
                    where: {
                      slot_reservation_id: item.slot_reservation_id,
                    },
                  }
                );
              });
            }

            res.send({ data });
          }
        }
      }
    } else {
      errorResponse(res, "cart already exist", 400, {});
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.update = async (req, res) => {
  try {
    let data = await db.order.update(
      {
        order_status: req.body.status,
      },
      {
        where: {
          order_id: req.body.order_id,
        },
      }
    );

    if (data == 1) {
      let order = await db.order.findOne({
        where: {
          order_id: req.body.order_id,
        },
        include: [{ model: db.seller }, { model: db.cart }],
      });

      if (order) {
        let orderData = order.get({ plain: true });
        let transactionObj = {};
        transactionObj["total_price"] = orderData.total_price;
        transactionObj["commission_percentage"] =
          orderData.Seller.commission_rate;
        transactionObj["receivable"] =
          transactionObj.total_price *
            (1 + transactionObj["commission_percentage"] / 100) -
          transactionObj.total_price;
        let transactionCount = await db.transaction.count();
        let pattern = "TRNS00000";
        switch (req.body.status.trim()) {
          case "Completed":
            //add transaction
            await db.transaction.create({
              transaction_code: getIDPattern(pattern, ++transactionCount),
              collected_amount: transactionObj.total_price,
              commission_amount: transactionObj.receivable,
              commission_rate: transactionObj.commission_percentage,
              customer_id: orderData.customer_id,
              seller_id: orderData.seller_id,
              order_id: req.body.order_id,
            });
            break;
          case "Refunded":
            // console.log(transactionObj.total_price)
            await db.transaction.create({
              transaction_code: getIDPattern(pattern, ++transactionCount),
              collected_amount: -Number(transactionObj.total_price),
              commission_amount: -Number(transactionObj.receivable),
              commission_rate: transactionObj.commission_percentage,
              customer_id: orderData.customer_id,
              seller_id: orderData.seller_id,
              order_id: req.body.order_id,
            });
            break;
          default:
            break;
        }
      }

      if (["Cancelled", "Refunded"].includes(req.body.status)) {
        let data = await db.order.findOne({
          where: { order_id: req.body.order_id },
          include: [
            {
              model: db.cart,
              required: false,
              include: { model: db.cartProduct },
            },
          ],
        });
        let cart = data.get({ plain: true }).cart;
        cart.cartProducts.map(async (item) => {
          try {
            let p = await db.product.findOne({
              where: {
                pid: item.productID,
              },
            });
            if (p) {
              p = p.get({ plain: true });
              await db.product.update(
                {
                  stock: p.stock + item.quantity,
                },
                {
                  where: {
                    pid: item.productID,
                  },
                }
              );
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
      db.order_trails.create({
        orderOrderId: req.body.order_id,
        status: req.body.status,
      });
      addNotification(req.body.order_id, req.body.status=="Completed"?"Completed ":req.body.status, "customer");
      res.send({
        success: true,
      });
    } else {
      res.status(400).send({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
// exports.getProduct = async (req, res) => {
//   try {
//     let data = await db.order.findAll({
//       where: { store_id: req.query.store_id },
//       include: [
//         {
//           model: db.order_trails,
//         },
//         {
//           model: db.customer,
//         },
//         {
//           model: db.cart,
//           required: false,
//           include: [
//             {
//               model: db.cartProduct,
//               required: false,
//               include: [{ model: db.product }],
//             },
//             {
//               model: db.slotReservation,
//               include: [{ model: db.service }],
//               required: true,
//             },
//             {
//               model: db.cartDayBoarding,
//               include: [{ model: db.service }],
//               required: true,
//             },
//           ],
//         },
//       ],
//     });
//     if (data) {
//       let updateData = data.map((node) => node.get({ plain: true }));
//       updateData.map((item) => {
//         delete item.customer.password;
//       });
//  if(updateData.length==0){
//       res.send({
//         success: true,
//         data: data,
//       });
//       return
//  }
//       res.send({
//         success: true,
//         data: updateData,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     errorResponse(res, "internal server error", 500, error);
//   }
// };
exports.getService = async (req, res) => {
  try {
    let data = await db.order.findAll({
      where: { store_id: req.query.store_id },
      include: [
        {
          model: db.order_trails,
        },
        {
          model: db.customer,
        },
        {
          model: db.cart,
          required: false,
          include: [
            {
              model: db.slotReservation,
              include: [{ model: db.service }],
              required: true,
            },
          ],
        },
      ],
    });
    if (data) {
      let updateData = data.map((node) => node.get({ plain: true }));
      updateData.map((item) => {
        // console.log(item.order_trail);
        delete item.customer.password;
      });
      updateData = updateData.filter((item) => item.cart != null);
      res.send({
        success: true,
        data: updateData,
      });
    }
  } catch (error) {
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.getServiceDayBoarding = async (req, res) => {
  try {
    let data = await db.order.findAll({
      where: { store_id: req.query.store_id },
      include: [
        {
          model: db.order_trails,
        },
        {
          model: db.customer,
        },
        {
          model: db.cart,
          required: true,
          include: [
            {
              model: db.cartDayBoarding,
              include: [{ model: db.service }],
              required: true,
            },
          ],
        },
      ],
    });
    if (data) {
      let updateData = data.map((node) => node.get({ plain: true }));
      updateData.map((item) => {
        // console.log(item.order_trail);
        delete item.customer.password;
      });

      updateData = updateData.filter((item) => item.cart != null);
      if (updateData.length == 0) {
        res.send({
          success: true,
          data: data,
        });
        return;
      }
      let promise = new Promise((resolve, reject) => {
        if (updateData[0]?.cart.onboardingCartItems.length == 0) {
          resolve(updateData);
        }
        updateData[0]?.cart.onboardingCartItems.map(async (item, index) => {
          try {
            let itemData = await db.service.findOne({
              where: {
                service_id: item.service_id,
              },
              raw: true,
            });
            if (itemData) {
              updateData[0].cart.onboardingCartItems[index].service = itemData;
            }
            if (index + 1 == updateData[0].cart.onboardingCartItems.length) {
              resolve(updateData);
            }
          } catch (error) {
            console.log(error);
            errorResponse(res, "internal server error", 500, error);
            return;
          }
        });
      });

      promise.then((data) => {
        res.send({
          success: true,
          data: data,
        });
      });
    }
  } catch (error) {
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.getOrder = async (req, res) => {
  try {
    let data = await db.order.findAll({
      where: { customer_id: req.query.customer_id },
      include: [
        {
          model: db.cart,
          required: true,
          include: [
            {
              model: db.store,
              include: {
                model: db.discounts,
                required: false,
                where: {
                  endDateTime: {
                    [sequelize.Op.gt]: moment(),
                  },
                },
              },
            },
            { model: db.slotReservation, include: [{ model: db.service }] },
            { model: db.cartDayBoarding, include: [{ model: db.service }] },
            { model: db.cartProduct, include: [{ model: db.product }] },
          ],
        },
        {
          model: db.payment,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (data) {
      if (data.length == 0) {
        res.send({
          success: true,
          data: [],
        });
        return;
      }
      let updateData = data.map((node) => node.get({ plain: true }));

      updateData = updateData.filter((item) => item.cart != null);
      if (updateData.length == 0) {
        res.send({
          success: true,
          data: data,
        });
        return;
      }

      let promise = new Promise((resolve, reject) => {
        if (updateData[0].cart.onboardingCartItems.length == 0) {
          resolve(updateData);
        }
        updateData[0].cart.onboardingCartItems.map(async (item, index) => {
          try {
            let itemData = await db.service.findOne({
              where: {
                service_id: item.service_id,
              },
              raw: true,
            });
            if (itemData) {
              updateData[0].cart.onboardingCartItems[index].service = itemData;
            }
            if (index + 1 == updateData[0].cart.onboardingCartItems.length) {
              resolve(updateData);
            }
          } catch (error) {
            console.log(error);
            errorResponse(res, "internal server error", 500, error);
            return;
          }
        });
      });

      promise.then((updateData) => {
        updateData = updateData.filter((item) => {
          if (
            item.cart.slotReservations.length > 0 ||
            item.cart.onboardingCartItems.length > 0 ||
            item.cart.cartProducts.length > 0
          ) {
            return item;
          }
        });
        updateData.map((item) => {
          if (item.payment) {
            item["payment_status"] = item.payment.command;
            delete item.payment;
          } else {
            item["payment_status"] = "pending";
          }
        });

        res.send({
          success: true,
          data: updateData,
        });
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.getAll = async (req, res) => {
  try {
    let promiseAll = await Promise.all([
      db.order.findAll({
        where: { store_id: req.query.store_id },
        include: [
          {
            model: db.payment,
          },
          {
            model: db.deliveryNotes,
          },
          {
            model: db.order_trails,
          },
          {
            model: db.cart,
            include: [
              {
                model: db.slotReservation,
                include: [{ model: db.service }],
              },
              {
                model: db.cartDayBoarding,
                include: [{ model: db.service }],
              },
              {
                model: db.cartProduct,
                include: [{ model: db.product }],
              },
              {
                model: db.resourceVet_slot,
                include: [{ model: db.resourceVet }],
              },
            ],
          },
        ],
      }),
    ]);
    if (promiseAll) {
      let data = promiseAll[0];

      if (data.length == 0) {
        res.send({
          success: true,
          data: [],
        });
        return;
      }
      let updateData = data.map((node) => node.get({ plain: true }));
      updateData.map((node) => {
        if (node.address == "  ") {
          node.address = null;
        }
      });
      updateData = updateData.filter((item) => item.cart != null);

      if (updateData.length == 0) {
        res.send({
          success: true,
          data: data,
          updateData2,
        });
        return;
      }
      let promise = new Promise((resolve, reject) => {
        if (updateData[0].cart.onboardingCartItems.length == 0) {
          resolve(updateData);
        }
        updateData[0].cart.onboardingCartItems.map(async (item, index) => {
          try {
            let itemData = await db.service.findOne({
              where: {
                service_id: item.service_id,
              },
              raw: true,
            });
            if (itemData) {
              updateData[0].cart.onboardingCartItems[index].service = itemData;
            }
            if (index + 1 == updateData[0].cart.onboardingCartItems.length) {
              resolve(updateData);
            }
          } catch (error) {
            console.log(error);
            errorResponse(res, "internal server error", 500, error);
            return;
          }
        });
      });
      promise.then((data) => {
        res.send({
          success: true,
          data: data,
        });
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.payment = async (req, res) => {
  try {
    let data = await db.payment.create(req.body);
    if (data) {
      db.order.update(
        {
          order_status: "Processing",
        },
        {
          where: {
            order_id: req.body.order_id,
          },
        }
      );
      if (req.body.isEmergency) {
        let resourceVet = await db.resourceVet.findAll({
          seller_id: req.body.seller_id,
          role: {
            [sequelize.Op.ne]: "Normal Appointment",
          },
        });
        if (resourceVet) {
          resourceVet = resourceVet.map((item) => item.get({ plain: true }));
          resourceVet.map((item) => {
            addNotification(
              req.body.order_id,
              "Emergency Video Call",
              "seller",
              item.device_token
            );
          });
        }
      } else {
        addNotification(req.body.order_id, "Order Payment", "seller");
      }

      res.send({
        success: true,
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.confirm = async (req, res) => {
  try {
    if (req.body.replace_confirm == "REJECTED") {
      let order = await db.order.findOne({
        where: {
          cartCartId: req.body.cart_id,
        },
      });

      if (order) {
        addNotification(order.order_id, req.body.replace_confirm, "seller");
        let payload = {};
        order = order.get({ plain: true });
        //first step extract old VAT
        let oldVt =
          Number(req.body.product_price) -
          Number(req.body.product_price) /
            (1 + Number(order.vat_percent) / 100);
        payload["sub_price"] =
          Number(order.sub_price).toFixed(2) -
          (Number(req.body.product_price) - oldVt);
        payload["vat_price"] = Number(order.vat_price - oldVt);
        payload["total_price"] =
          Number(order.total_price) - Number(req.body.product_price);
        payload["order_status"] = "Processing";

        payload["refund_price"] = payload.total_price - order.total_price;
        if (payload["sub_price"] <= 0) {
          payload["order_status"] = "Cancelled";
          payload["total_price"] = 0.0;
          payload["sub_price"] = 0.0;
          payload["sub_price"] = 0.0;
          payload["vat_price"] = 0.0;
          payload["shipment_price"] = 0.0;
          payload["vat_shipment"] = 0.0;
        }
        let update = await db.order.update(payload, {
          where: {
            order_id: order.order_id,
          },
        });
        let updateReplaceable = null;
        if (req.body.cartProductID) {
          updateReplaceable = await db.cartProduct.destroy({
            where: {
              cartProductID: req.body.cartProductID,
            },
          });
        }
        if (req.body.slot_reservation_id) {
          updateReplaceable = await db.slotReservation.destroy({
            where: {
              slot_reservation_id: req.body.slot_reservation_id,
            },
          });
        }

        if (update == 1 && updateReplaceable == 1) {
          res.send({
            success: true,
            message: "Product/slot removed",
          });
        } else {
          res.status(400).send({
            success: false,
            message: "Product/slot  not removed",
          });
        }
      }
    } else {
      let order = await db.order.findOne({
        where: {
          cartCartId: req.body.cart_id,
        },
      });
      if (order) {
        order = order.get({ plain: true });
        addNotification(order.order_id, req.body.replace_confirm, "seller");
        let update = null;

        if (req.body.cartProductID) {
          update = await db.cartProduct.update(req.body, {
            where: {
              cartProductID: req.body.cartProductID,
            },
          });
        }
        if (req.body.slot_reservation_id) {
          update = await db.slotReservation.update(req.body, {
            where: {
              slot_reservation_id: req.body.slot_reservation_id,
            },
          });
        }

        if (update == 1) {
          res.send({
            success: true,
          });
        } else {
          res.status(400).send({
            success: false,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.replacement_add = async (req, res) => {
  try {
    req.body["replace_confirm"] = "no";
    req.body["replace"] = "r";

    let data = await db.cartProduct.create(req.body);
    if (data) {
      let payload = {};
      data = data.get({ plain: true });
      let order = await db.order.findOne({
        where: {
          cartCartId: req.body.cart_id,
        },
      });
      if (order) {
        let updateReplaceable = await db.cartProduct.update(
          {
            replace: "on",
          },
          {
            where: {
              cartProductID: req.body.old_cartProductID,
            },
          }
        );

        order = order.get({ plain: true });
        addNotification(order.order_id, "Replacement", "customer");
        //first step extract old VAT
        let oldVt =
          Number(req.body.oldproduct_price) -
          Number(req.body.oldproduct_price) /
            (1 + Number(order.vat_percent) / 100);
        let newVt =
          Number(req.body.newproduct_price) -
          Number(req.body.newproduct_price) /
            (1 + Number(order.vat_percent) / 100);

        payload["sub_price"] =
          Number(order.sub_price).toFixed(2) -
          (Number(req.body.oldproduct_price) - oldVt);

        payload["vat_price"] = Number(order.vat_price - oldVt + newVt);
        //sub price
        payload["sub_price"] =
          payload["sub_price"] + Number(req.body.newproduct_price - newVt);

        payload["total_price"] =
          Number(order.total_price) -
          Number(req.body.oldproduct_price) +
          Number(req.body.newproduct_price);
        if (order.total_price < payload["total_price"]) {
          res.status(400).send({
            success: false,
            message: "new total_price is exceeded",
            total_price: payload["total_price"],
          });
          return;
        }
        payload["refund_price"] = payload.total_price - order.total_price;
        payload["order_status"] = "Replacement";

        let update = await db.order.update(payload, {
          where: {
            order_id: order.order_id,
          },
        });
        if (update == 1 && updateReplaceable == 1) {
          let dataOrder = await db.order.findOne({
            where: {
              order_id: order.order_id,
            },
            include: [
              {
                model: db.payment,
              },
              {
                model: db.deliveryNotes,
              },
              {
                model: db.order_trails,
              },
              {
                model: db.cart,
                required: false,
                include: [
                  {
                    model: db.slotReservation,
                    include: [{ model: db.service }],
                    required: false,
                  },
                  {
                    model: db.cartDayBoarding,
                    include: [{ model: db.service }],
                    required: false,
                  },
                  {
                    model: db.cartProduct,
                    include: [{ model: db.product }],
                    required: false,
                  },
                  {
                    model: db.resourceVet_slot,
                    include: [{ model: db.resourceVet }],
                  },
                ],
              },
            ],
          });
          if (dataOrder) {
            res.send({
              success: true,
              data: dataOrder,
            });
          }
        } else {
          res.status(400).send({
            success: false,
          });
        }
      } else {
        res.status(404).send({
          success: false,
          message: "order not found",
        });
      }
    }
  } catch (error) {
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.order_inc_dec = async (req, res) => {
  try {
    let payload = {};

    let order = await db.order.findOne({
      where: {
        cartCartId: req.body.cart_id,
      },
    });

    if (order) {
      let product = await db.cartProduct.findOne({
        where: {
          cartProductID: req.body.product_id,
        },
      });
      if (product) {
        product = product.get({ plain: true });
        order = order.get({ plain: true });
        addNotification(order.order_id, "Quantity Updated", "customer");
        //first step extract old VAT
        let Oldproduct_price = product.price * product.quantity;
        let newproduct_price = product.price * req.body.quantity;
        payload["Oldproduct_price"] = Oldproduct_price;
        payload["newproduct_price"] = newproduct_price;
        let oldVt =
          Number(Oldproduct_price) -
          Number(Oldproduct_price) / (1 + Number(order.vat_percent) / 100);
        payload["OldVT"] = oldVt;

        let newVt =
          Number(newproduct_price) -
          Number(newproduct_price) / (1 + Number(order.vat_percent) / 100);
        payload["NEWVT"] = newVt;
        payload["order.vat_price"] = order.vat_price;
        payload["vat_price"] = Number(order.vat_price - oldVt + newVt);
        //sub price
        payload["sub_price"] =
          order.sub_price -
          Number(Oldproduct_price - oldVt) +
          Number(newproduct_price - newVt);

        payload["total_price"] =
          Number(order.total_price) -
          Number(Oldproduct_price) +
          Number(newproduct_price);

        if (req.body.new_product_id) {
          let newproduct_price = req.body.new_price * req.body.new_quantity;

          let newVt =
            Number(newproduct_price) -
            Number(newproduct_price) / (1 + Number(order.vat_percent) / 100);

          await db.cartProduct.create({
            quantity: req.body.new_quantity,
            productID: req.body.new_product_id,
            cart_id: req.body.cart_id,
            price: req.body.new_price,
            replace: "r",
            replace_confirm: "no",
          });

          payload["total_price"] = payload["total_price"] + newproduct_price;

          payload["vat_price"] = payload["vat_price"] + newVt;
          payload["sub_price"] =
            payload["sub_price"] + Number(newproduct_price - newVt);
        }
        payload["refund_price"] = payload.total_price - order.total_price;
        payload["order_status"] = "Replacement";
        let product_update = await db.cartProduct.update(
          {
            quantity: req.body.quantity,
          },
          {
            where: {
              cartProductID: req.body.product_id,
            },
          }
        );

        let update = await db.order.update(payload, {
          where: {
            order_id: order.order_id,
          },
        });

        if (update == 1 && product_update == 1) {
          let dataOrder = await db.order.findOne({
            where: {
              order_id: order.order_id,
            },
            include: [
              {
                model: db.deliveryNotes,
              },
              {
                model: db.order_trails,
              },
              {
                model: db.payment,
              },
              {
                model: db.cart,
                required: false,
                include: [
                  {
                    model: db.slotReservation,
                    include: [{ model: db.service }],
                    required: false,
                  },
                  {
                    model: db.cartDayBoarding,
                    include: [{ model: db.service }],
                    required: false,
                  },
                  {
                    model: db.cartProduct,
                    include: [{ model: db.product }],
                    required: false,
                  },
                  {
                    model: db.resourceVet_slot,
                    include: [{ model: db.resourceVet }],
                  },
                ],
              },
            ],
          });
          if (dataOrder) {
            res.send({
              success: true,
              data: dataOrder,
            });
          }
        } else {
          res.status(400).send({
            success: false,
          });
        }
      } else {
        res.status(404).send({
          success: false,
          message: "product not found",
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: "order not found",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};
exports.lastMileDeliveryAdd = (req, res) => {
  var config = {
    method: "post",
    url: "https://api.ngage.lyveglobal.com/v1/orders",
    headers: {
      "x-access-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJMeXZlIiwic3ViIjoiUGV0c2V0IEdvIiwiYXVkIjoiaHR0cHM6Ly9hcGkubmdhZ2UubHl2ZWdsb2JhbC5jb20vdjEvcG9pcyIsInZlciI6IjEiLCJoYXNoIjoiY2NhNGE2ZjU2ZGIwMjk5MjYxOWZiZTliZDFjYzQwYWIiLCJpYXQiOjE2NTYwODk5MTMsImV4cCI6MTc4MDUwNTkxM30.dsE60cjcPEVzPGNNGIIFDIpwMVmmliodJQ2TT0VsjdI",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ data: req.body.data }),
  };
  axios(config)
    .then(async (response) => {
      if (
        response.data.orders[req.body.data[0].order_number].error_description
      ) {
        res.status(400).send({
          success: false,
          message:
            response.data.orders[req.body.data[0].order_number]
              .error_description,
        });
        return;
      }
      db.order_trails
        .create({
          orderOrderId: req.body.order_id,
          status: "Tracking Assigned",
        })
        .then((data) => {})
        .catch((err) => {});
      db.deliveryNotes
        .create({
          _id: req.body.data[0].order_number,
          order_id: req.body.order_id,
        })
        .then((data) => {
          res.send({
            success: true,
            data: data,
          });
        })
        .catch((error) => {
          console.log(error);
          errorResponse(res, error.data, 400, error);
          return;
        });
    })
    .catch(function (error) {
      console.log(error.data);
      errorResponse(res, "internal server error", 500, error);
    });
};

exports.paymentOperation = async (req, res) => {
  try {
    const data = {
      access_code: "PC8iIGFRkPtgz0oHNfMw",
      merchant_identifier: "47129ec7",
      language: "en",
      command: req.body.command,
      fort_id: req.body.fort_id, // the original transaction ID
    };
    if (req.body.command != "VOID_AUTHORIZATION") {
      (data["amount"] = req.body.payment_amount), // amount to be captured in the smallest unit for the currency (e.g. cents for USD)
        (data["currency"] = "AED");
    }
    let sha_request_phrase = "61qwT.x.Me7VK623su6vYW&!";
    // Generate the signature
    const sha256 = crypto.createHash("sha256");
    let signatureString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("");

    signatureString = sha_request_phrase + signatureString + sha_request_phrase;
    let signature = sha256.update(signatureString, "utf8").digest("hex");

    // Add the signature to the request payload
    data.signature = signature;

    // Set up the request headers
    const headers = {
      "Content-Type": "application/json",
    };
    // Make the request to the Payfort API
    axios
      .post("https://paymentservices.payfort.com/FortAPI/paymentApi", data, {
        headers,
      })
      .then((response) => {
        // Capture successful
        if (response.data.response_message == "Success") {
          db.payment.update(
            { command: req.body.command },
            {
              where: {
                pay_id: req.body.pay_id,
              },
            }
          );
        }

        res.send({
          data: response.data,
        });
      })
      .catch((error) => {
        // Capture failed

        errorResponse(res, "internal server error", 500, error);
      });
  } catch (error) {
    // Capture failed
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};

exports.getNotification = async (req, res) => {
  try {
    let q = {};
    if (req.query.store_id) {
      q["store_id"] = req.query.store_id;
      q["type"] = ["New Order", "REJECTED","Assign To Driver", "CONFIRMED", "Slot Reschedule","Completed"];
    } else {
      q["customer_id"] = req.query.customer_id;
      q["type"] = [
        "Assign To Driver ",
        "Completed ",
        "REJECTED",
        "CONFIRMED",
        "Replacement",
        "Pending Payment",
        "Processing",
        "Slot Reschedule",
        "On Hold",
        "Cancelled",
        "Refunded",
        "delivered",
        "Failed",
        "Cancel Request",
        "Out For Delivery",
        "Quantity Updated",
      ];
    }
    let data = await db.notification.findAll({
      where: q,
      order: [["updatedAt", "DESC"]],
    });
    if (data) {
      res.send({
        success: true,
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, "internal server error", 500, error);
  }
};

exports.getServiceDayBoardingCalender = async (req, res) => {
  try {
    let data = await db.cart.findAll({
      where: { shop_id: req.query.store_id },
      include: [
        {
          model: db.cartDayBoarding,
          required: true,
        },
        {
          model: db.customer,
          attributes: [["first_name", "customer_name"]],
        },
        {
          model: db.order,
        },
      ],
    });
    let blockDate = await db.dayCare_DayBoarding_Days.findAll({
      where: {
        store_id: req.query.store_id,
      },
    });
    if (data && blockDate) {
      data = data.map((node) => node.get({ plain: true }));
      let dataPayload = [];
      data.map((item) => {
        item.onboardingCartItems.map((node) => {
          node["customer_name"] = item.customer.customer_name;
          node["orderID"] = item.order.orderID;
          node["order_id"] = item.order.order_id;
          dataPayload.push(node);
        });
      });
      res.send({
        success: true,
        data: { orders: dataPayload, blockDates: blockDate },
      });
    }
  } catch (error) {
    errorResponse(res, "internal server error", 500, error);
  }
};
console.log(moment.tz("Asia/Dubai").format("YYYY-MM-DD hh:mm:ss Z"));
