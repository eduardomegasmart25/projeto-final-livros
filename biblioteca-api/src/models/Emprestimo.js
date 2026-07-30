const mongoose = require("mongoose");

const emprestimoSchema = new mongoose.Schema(
  {
    livro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livro",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    dataEmprestimo: {
      type: Date,
      default: Date.now,
    },
    dataDevolucaoPrevista: {
      type: Date,
      required: true,
    },
    dataDevolucaoReal: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["emprestado", "devolvido", "atrasado"],
      default: "emprestado",
    },
    preco: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emprestimo", emprestimoSchema);
