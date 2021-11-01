export const transformProduct = ({ product, variants }) => {
  if (!product || !variants) throw new Error("Missing inputs!");

  return {
    ...product,
    unit: product.unit.toLowerCase(),
    category: product.category.toLowerCase(),
    _class: product._class.toLowerCase(),
    description: product.description === "" ? undefined : product.description,
    images:
      product.images.length === 0
        ? undefined
        : product.images.map((url) => ({ url })),
    variants: variants.map((variant) => {
      variant.description =
        variant.description === "" ? undefined : product.description;

      return variant;
    }),
  };
};
