const users = {
  1: {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com"
  }
};

const orders = {
  1: {
    id: 1,
    ref: "#ord-2018-a993bee3",
    status: "paid",
    tracking: {
      carrier: "UPS",
      trackingCode: "DAJA91930102NDAKKS0",
      status: "in_transit"
    },
    items: [
      {
        sku: "emb-mb-s",
        name: "Embrace Watch - Stretchable Band Black",
        amount: 249
      }
    ],
    discounts: [
      {
        name: "Christmas 2018 - 10% OFF",
        type: "percent",
        value: 10
      }
    ]
  },
  2: {
    id: 2,
    ref: "#ord-2018-b6012cc8",
    status: "paid",
    tracking: null,
    items: [
      {
        sku: "emb-bb-s",
        name: "Embrace Watch - Stretchable Band Blue",
        amount: 249
      },
      {
        sku: "emb-mb-s",
        name: "Embrace Watch - Stretchable Band Black",
        amount: 249
      }
    ],
    discounts: [
      {
        name: "2x1 Embrace",
        type: "amount",
        value: 249
      }
    ]
  }
};

const userOrders = {orders: [orders[1], orders[2]]};

module.exports = {
  users: users,
  orders: orders,
  userOrders: userOrders
}
