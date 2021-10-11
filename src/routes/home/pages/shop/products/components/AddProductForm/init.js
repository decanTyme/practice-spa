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
  description: "Any description of the product here...",
  images: [],
};

export const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
  inputCode: false,
};

export const INIT_BTN_TEXT = {
  saveBtn: "Save",
  resetBtn: "Reset",
};

export const getInitVariantVal = () => {
  return {
    id: customNanoid(),
    name: "",
    value: "",
    prices: [
      {
        id: customNanoid(),
        label: "retail",
        value: 0,
        description: "The price for a regular customer.",
      },
      {
        id: customNanoid(),
        label: "reseller",
        value: 0,
        description: "The price for a reseller.",
      },
      {
        id: customNanoid(),
        label: "bulker",
        value: 0,
        description: "The price for a bulker or wholesaler.",
      },
      {
        id: customNanoid(),
        label: "city distributor",
        value: 0,
        description: "The price for a city distributor.",
      },
      {
        id: customNanoid(),
        label: "provincial distributor",
        value: 0,
        description: "The price for a provincial distributor.",
      },
      {
        id: customNanoid(),
        label: "sale",
        value: 0,
        description: "The price for a regular customer.",
      },
    ],
    description: "Any description of the variant here...",
    images: [],
  };
};
