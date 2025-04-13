import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Trash2, Pen, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";
import CheckBox from "./CheckBox";
import { getDateByDay } from "../../services/formatDate";
import { deleteActivity, getActivity, updateActivity } from "../../services";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";

const body = () => {
  return  data && (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      key={data && data._id}
      className="divide-y-2 divide-gray-700 text-[.8rem]"
    >
      <td className="py-2 text-gray-400">{index + 1}</td>
      <td className="py-2 text-gray-400">
        {data && data.activity}
      </td>
      <td className="py-2 text-gray-400">
        {data && data.workout}
      </td>
      <td className="py-2 text-gray-400">
        {data && data.calories}
      </td>
      <td className="py-2 text-gray-400">
        {data && data.heartRate}
      </td>
      <td className="py-2 text-gray-400">
        {data && data.distanceCovered}
      </td>
      <td className="py-2 text-gray-400">
        {data && data.stepsCount}
      </td>
      <td className="py-2 text-gray-400">
        {getDateByDay(data && data.createdAt)}
      </td>
      {/* <td className="py-2 text-gray-400">
        {data && data.duration}
      </td> */}
      <td className="py-2">
        <Button
          name={data && data.status}
          className="bg-green-800 text-gray-100"
          onClick={() => {
            handleCompleted( data._id)
          }}
        />
      </td>
  
      <td>
        {/* <Link to={`/challenges/activity/${data._id}`}> */}
          <Button
            icon={Pen}
            className="text-violet-600"
            onClick={e => handleEdit(data._id, data)}
          ></Button>
        {/* </Link> */}
      </td>
      <td>
        <Button
          icon={Trash2}
          className="text-red-600"
          onClick={() => handleDeleteActivity(data && data._id)}
          onContextMenu={() => handleTrack(e)}
        ></Button>
      </td>
    </motion.tr>
  )
}



const DataTable = ({tableHeaders, tableData, searchText, handleFilter, handleDeleteActivity, handleCompleted, handleEdit, startIndex, endIndex, handlePaginate ,
setIsSubmit

}) => {
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div className="w-full overflow-x-auto bg-slate-200 px-4 py-6 dark:bg-gray-800">
      <div className="flex justify-end">
        <SearchBar
          placeholder="Search activities"
          value={searchText}
          onChange={handleFilter}
        />
      </div>
      <h2 className="mb-4 text-2xl text-gray-700 dark:text-gray-400">
        Activities
      </h2>

      {
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  className="py-4 text-left font-medium tracking-wider text-gray-400"
                  key={index}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => {
              return (
                data && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    key={data && data._id}
                    className="divide-y-2 divide-gray-700 text-[.8rem]"
                  >
                    <td className="py-2 text-gray-400">{index + 1}</td>
                    <td className="py-2 text-gray-400">
                      {data && data.activity}
                    </td>
                    <td className="py-2 text-gray-400">
                      {data && data.workout}
                    </td>
                    <td className="py-2 text-gray-400">
                      {data && data.calories}
                    </td>
                    <td className="py-2 text-gray-400">
                      {data && data.heartRate}
                    </td>
                    <td className="py-2 text-gray-400">
                      {data && data.distanceCovered}
                    </td>
                    <td className="py-2 text-gray-400">
                      {data && data.stepsCount}
                    </td>
                    <td className="py-2 text-gray-400">
                      {getDateByDay(data && data.createdAt)}
                    </td>
                    {/* <td className="py-2 text-gray-400">
                      {data && data.duration}
                    </td> */}
                    <td className="py-2">
                      <Button
                        name={data && data.status}
                        className="bg-green-800 text-gray-100"
                        onClick={() => {
                          handleCompleted( data._id)
                        }}
                      />
                    </td>
                
                    <td>
                      {/* <Link to={`/challenges/activity/${data._id}`}> */}
                        <Button
                          icon={Pen}
                          className="text-violet-600"
                          onClick={e => handleEdit(data._id, data)}
                        ></Button>
                      {/* </Link> */}
                    </td>
                    <td>
                      <Button
                        icon={Trash2}
                        className="text-red-600"
                        onClick={() => handleDeleteActivity(data && data._id)}
                        onContextMenu={() => handleTrack(e)}
                      ></Button>
                    </td>
                  </motion.tr>
                )
              
              );
            })}
          </tbody>
        </table>
      }
      <div className="mt-2 flex justify-end text-gray-300">
        {/* <p>
          {`${!startIndex ? startIndex + 1 : startIndex + 2} - ${endIndex}`} of{" "}
          {tableData.length}
        </p> */}
        <Button
          icon={ChevronLeft}
          onClick={() => {
            if (pageNumber) setPageNumber(pageNumber - 1);
            handlePaginate(0);
          }}
          disabled={startIndex === 0}
        />
        <Button
          icon={ChevronRight}
          onClick={() => {
            setPageNumber(pageNumber + 1);
            handlePaginate(endIndex);
          }}
          disabled={endIndex === tableData.length - 1}
        />
      </div>
    </div>
  );
};

export default DataTable;
