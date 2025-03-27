
const Stats = ({...props}) => {



  return (
    <div 
    className=" bg-slate-200 dark:bg-gray-800"
    >
        <p>{...props.title}</p>
        <span>{props.count}</span>
    </div>
  )
}

export default Stats
