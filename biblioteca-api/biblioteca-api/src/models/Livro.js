const mongoose = require("mongoose");

const livroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
    },
    autor: {
      type: String,
      required: [true, "O autor é obrigatório"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "O ISBN é obrigatório"],
      unique: true,
      trim: true,
    },
    categoria: {
      type: String,
      trim: true,
      default: "Geral",
    },
    anoPublicacao: {
      type: Number,
    },
    quantidadeTotal: {
      type: Number,
      required: true,
      min: [0, "A quantidade total não pode ser negativa"],
      default: 1,
    },
    quantidadeDisponivel: {
      type: Number,
      required: true,
      min: [0, "A quantidade disponível não pode ser negativa"],
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Livro", livroSchema);
