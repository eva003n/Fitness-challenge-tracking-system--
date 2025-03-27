import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//extend dayjs wirh relative time plugin
dayjs.extend(relativeTime);
const getDateByDay = (date) => dayjs(date).format("DD-MM-YYYY")
const getDateByMonth = (date) => dayjs(date).format("MM-DD-YYYY")
const getDateByYear = (date) => dayjs(date).format("YYYY-MM-DD")

//get date, year and month
const getDate = (date) => dayjs(date).date()
const getMonth = (date) => dayjs(date).month()  //zere based 
const getYear = (date) => dayjs(date).year()

const now = dayjs()
//ditfference between now and the deadline for challenge in days
const getDateDifference = (date, day = now) => dayjs(date).diff(day, "day")
//get time from now
const getTimeFromNow = (pastDate) => dayjs(pastDate).fromNow()

const getIsoDate = () => now.toISOString()

export {
    getDateByDay,
    getDateByMonth,
    getDateByYear,
    getDateDifference,
    getDate,
    getMonth,
    getYear,
    getTimeFromNow,
    getIsoDate
}