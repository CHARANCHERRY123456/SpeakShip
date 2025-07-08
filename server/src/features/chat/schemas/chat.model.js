// server/src/features/chat/schemas/chat.model.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ['customer', 'driver'], required: true },
    },
  ],
  deliveryOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', required: true },
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
