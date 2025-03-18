const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const bodyMetricsSchema = new mongoose.Schema(
    {
        user: { type: ObjectId, required: true },
        bf: { type: mongoose.Types.Decimal128, require: true }, // BF% (Tỷ lệ mỡ)
        vfa: { type: mongoose.Types.Decimal128, require: true }, // VFA (Mỡ nội tạng)
        lbm: { type: mongoose.Types.Decimal128, require: true }, // LBM (Khối lượng cơ không mỡ)
        smm: { type: mongoose.Types.Decimal128, require: true }, // SMM (Tổng khối cơ bắp)
        tbw: { type: mongoose.Types.Decimal128, require: true }, // TBW (Tổng nước trong cơ thể)
        bmr: { type: mongoose.Types.Decimal128, require: true }, // BMR (Tỷ lệ trao đổi chất)
        tdee: { type: mongoose.Types.Decimal128, require: true }, // TDEE (Tổng calo tiêu hao)
        ffmi: { type: mongoose.Types.Decimal128, require: true }, // FFMI (Chỉ số cơ không mỡ)
        whr: { type: mongoose.Types.Decimal128, require: true }, // WHR (Tỷ lệ eo/mông)
        whtr: { type: mongoose.Types.Decimal128, require: true }, // WHtR (Tỷ lệ eo/chiều cao)
        weight: { type: mongoose.Types.Decimal128, require: true }, // Cân nặng (kg)
        height: { type: mongoose.Types.Decimal128, require: true }, // Chiều cao (cm)
        age: { type: Number, require: true }, // Tuổi
        gender: { type: String, require: true }, // Giới tính ("male" / "female")
        waist: { type: mongoose.Types.Decimal128, require: true }, // Vòng eo (cm)
        hip: { type: mongoose.Types.Decimal128, require: true }, // Vòng mông (cm)
        neck: { type: mongoose.Types.Decimal128, require: true }, // Vòng cổ (cm)
        arm: { type: mongoose.Types.Decimal128, require: true }, // Vòng bắp tay (cm)
        thigh: { type: mongoose.Types.Decimal128, require: true }, // Vòng đùi (cm)
    },
    {
        timestamps: true,
    }
);

const BodyMetrics = mongoose.model("bodyMetrics", bodyMetricsSchema);

module.exports = BodyMetrics;
