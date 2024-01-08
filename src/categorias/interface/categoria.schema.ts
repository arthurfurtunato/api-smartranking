import mongoose from 'mongoose';

export const CategoriaSchema = new mongoose.Schema(
  {
    categoria: { type: String, unique: true },
    descricao: String,
    jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' }],
    eventos: [
      {
        nome: String,
        operacao: String,
        valor: Number,
      },
    ],
  },
  { timestamps: true, collection: 'categorias' },
);
