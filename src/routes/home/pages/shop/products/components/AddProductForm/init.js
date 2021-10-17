import { customAlphabet } from "nanoid";

export const customNanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20
);

export const INIT_FORM_VAL = {
  name: "",
  code: "",
  brand: "",
  _class: "",
  category: "",
  unit: "single",
  description: "",
  images: [],
};

export const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
  inputCode: false,
};

export const INIT_BTN_TEXT = {
  submitBtn: "Save",
  resetBtn: "Reset",
};

export const getInitVariantVal = () => {
  return {
    __id: customNanoid(),
    name: "",
    value: "",
    prices: [
      {
        __id: customNanoid(),
        label: "retail",
        value: 0,
        description: "The price for a regular customer.",
      },
      {
        __id: customNanoid(),
        label: "reseller",
        value: 0,
        description: "The price for a reseller.",
      },
      {
        __id: customNanoid(),
        label: "bulker",
        value: 0,
        description: "The price for a bulker or wholesaler.",
      },
      {
        __id: customNanoid(),
        label: "city distributor",
        value: 0,
        description: "The price for a city distributor.",
      },
      {
        __id: customNanoid(),
        label: "provincial distributor",
        value: 0,
        description: "The price for a provincial distributor.",
      },
      {
        __id: customNanoid(),
        label: "sale",
        value: 0,
        description: "The price for a regular customer.",
      },
    ],
    description: "",
    images: [],
  };
};
