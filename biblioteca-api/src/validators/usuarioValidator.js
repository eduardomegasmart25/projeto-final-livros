const Joi = require("joi");

const usuarioSchema = Joi.object({
  nome: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  telefone: Joi.string().trim().optional(),
  matricula: Joi.string().trim().optional(),
  ativo: Joi.boolean().optional(),
  role: Joi.string().valid("usuario", "bibliotecario").default("usuario"),
});

const usuarioUpdateSchema = Joi.object({
  nome: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  senha: Joi.string().min(6).optional(),
  telefone: Joi.string().trim().optional(),
  matricula: Joi.string().trim().optional(),
  ativo: Joi.boolean().optional(),
  role: Joi.string().valid("usuario", "bibliotecario").optional(),
});

module.exports = { usuarioSchema, usuarioUpdateSchema };
