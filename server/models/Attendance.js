import mongoose from "mongoose"

const atttendanceSchema = new mongoose.Schema({
    employeeId :{type:mongoose.Schema.Types.ObjectId,ref:"Employee",required: true},
    date :{type: Date, required:true},
    checkIn : {type:Date ,default: null},
    checkOut : {type:Date, default: null},
    dayType : {type: String, enum: ["Full Day","Three Quater Day","Half Day","Short Day",null],default: null},
    workingHours: {type: Number, default:null},
    status: {type: String, enum :["PRESENT","ABSENT","LATE"],default: "PRESENT"},

},{timestamps: true})

atttendanceSchema.index({employeeId: 1, date:1},{unique: true})

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", atttendanceSchema)

export default Attendance;