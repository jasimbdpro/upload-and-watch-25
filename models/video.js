import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);
export { Video };
