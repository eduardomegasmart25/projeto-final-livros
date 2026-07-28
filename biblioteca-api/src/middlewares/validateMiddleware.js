function validarSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        erro: "Dados inválidos",
        detalhes: error.details.map((detalhe) => detalhe.message),
      });
    }

    next();
  };
}

module.exports = validarSchema;
