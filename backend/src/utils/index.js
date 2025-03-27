import dayjs from "dayjs"
import mongoose from "mongoose";

const formatAndConvertObjectId = (id) => new mongoose.Types.ObjectId(id);


//working with dates

//reset a given date to the start of the day
const getDayStart = (day) => dayjs(day).startOf("day")
//compare day similality
const similarityCheck = (today, lastUpdate) => lastUpdate.isSame(today, "day")
//add one day to yesterday and ckeck if diff is one day
const addOneDayAndVerify = (today, lastUpdate) => lastUpdate.add(1, "day").isSame(today, "day")

const getIsoDate = (date) => dayjs(date).toISOString()

const getDateDifference = (endDate, currentDate = new Date()) => dayjs(endDate).diff(currentDate, "day")



export { getDayStart, similarityCheck,  formatAndConvertObjectId, addOneDayAndVerify, getIsoDate, getDateDifference }