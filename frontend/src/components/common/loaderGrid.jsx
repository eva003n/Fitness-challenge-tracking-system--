import React from "react";

function LoaderGrid() {
  return (
    <div className="relative grid min-h-svh auto-rows-[24rem] grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4 px-4">
      <div
        className="rounded-lg bg-white py-4 dark:bg-gray-950"
        key={challenge._id}
      >
        <div className="mx-auto grid w-[90%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between text-gray-100">
              {/* <time dateTime="2022-10-10" className="text-gray-400">
                Tuesday Feb 5
              </time> */}
              <div className="flex gap-4 text-[12px] text-gray-400">
                <p>Workout</p>
                <span className="text-1xl font-extrabold text-violet-700">
                  {challenge.workOutType}
                </span>
              </div>
            </div>
          </div>
          <div className="h-38 self-center overflow-hidden rounded-md mix-blend-plus-darker shadow-2xl shadow-gray-700">
            <img
              src={challenge.image.imageUrl}
              alt={challenge.workOutType}
              className="h-full w-full"
            />
          </div>
          <p className="text-1xl text-gray-100">{challenge.challengeName}</p>
          <p className="text-[13px] text-gray-300">{challenge.description}</p>

          <div className="flex gap-4 text-[12px] text-gray-400">
            <p>Duration:</p>
            <span className="text-1xl">{challenge.duration} days</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-[12px] text-gray-400">
              <p>Status</p>
              <span className="text-1xl font-extrabold text-green-600">
                {challenge.status}
              </span>
            </div>

            <div className="flex gap-4 text-gray-400">
              <div className="flex gap-4">
                <Pen size={18} strokeWidth={2} className="text-violet-600" />
                <p>Edit</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Trash2 size={18} strokeWidth={2} className="text-red-500" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg bg-white py-4 dark:bg-gray-950"
        key={challenge._id}
      >
        <div className="mx-auto grid w-[90%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between text-gray-100">
              {/* <time dateTime="2022-10-10" className="text-gray-400">
                Tuesday Feb 5
              </time> */}
              <div className="flex gap-4 text-[12px] text-gray-400">
                <p>Workout</p>
                <span className="text-1xl font-extrabold text-violet-700">
                  {challenge.workOutType}
                </span>
              </div>
            </div>
          </div>
          <div className="h-38 self-center overflow-hidden rounded-md mix-blend-plus-darker shadow-2xl shadow-gray-700">
            <img
              src={challenge.image.imageUrl}
              alt={challenge.workOutType}
              className="h-full w-full"
            />
          </div>
          <p className="text-1xl text-gray-100">{challenge.challengeName}</p>
          <p className="text-[13px] text-gray-300">{challenge.description}</p>

          <div className="flex gap-4 text-[12px] text-gray-400">
            <p>Duration:</p>
            <span className="text-1xl">{challenge.duration} days</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-[12px] text-gray-400">
              <p>Status</p>
              <span className="text-1xl font-extrabold text-green-600">
                {challenge.status}
              </span>
            </div>

            <div className="flex gap-4 text-gray-400">
              <div className="flex gap-4">
                <Pen size={18} strokeWidth={2} className="text-violet-600" />
                <p>Edit</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Trash2 size={18} strokeWidth={2} className="text-red-500" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg bg-white py-4 dark:bg-gray-950"
        key={challenge._id}
      >
        <div className="mx-auto grid w-[90%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between text-gray-100">
              {/* <time dateTime="2022-10-10" className="text-gray-400">
                Tuesday Feb 5
              </time> */}
              <div className="flex gap-4 text-[12px] text-gray-400">
                <p>Workout</p>
                <span className="text-1xl font-extrabold text-violet-700">
                  {challenge.workOutType}
                </span>
              </div>
            </div>
          </div>
          <div className="h-38 self-center overflow-hidden rounded-md mix-blend-plus-darker shadow-2xl shadow-gray-700">
            <img
              src={challenge.image.imageUrl}
              alt={challenge.workOutType}
              className="h-full w-full"
            />
          </div>
          <p className="text-1xl text-gray-100">{challenge.challengeName}</p>
          <p className="text-[13px] text-gray-300">{challenge.description}</p>

          <div className="flex gap-4 text-[12px] text-gray-400">
            <p>Duration:</p>
            <span className="text-1xl">{challenge.duration} days</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-[12px] text-gray-400">
              <p>Status</p>
              <span className="text-1xl font-extrabold text-green-600">
                {challenge.status}
              </span>
            </div>

            <div className="flex gap-4 text-gray-400">
              <div className="flex gap-4">
                <Pen size={18} strokeWidth={2} className="text-violet-600" />
                <p>Edit</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Trash2 size={18} strokeWidth={2} className="text-red-500" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg bg-white py-4 dark:bg-gray-950"
        key={challenge._id}
      >
        <div className="mx-auto grid w-[90%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between text-gray-100">
              {/* <time dateTime="2022-10-10" className="text-gray-400">
                Tuesday Feb 5
              </time> */}
              <div className="flex gap-4 text-[12px] text-gray-400">
                <p>Workout</p>
                <span className="text-1xl font-extrabold text-violet-700">
                  {challenge.workOutType}
                </span>
              </div>
            </div>
          </div>
          <div className="h-38 self-center overflow-hidden rounded-md mix-blend-plus-darker shadow-2xl shadow-gray-700">
            <img
              src={challenge.image.imageUrl}
              alt={challenge.workOutType}
              className="h-full w-full"
            />
          </div>
          <p className="text-1xl text-gray-100">{challenge.challengeName}</p>
          <p className="text-[13px] text-gray-300">{challenge.description}</p>

          <div className="flex gap-4 text-[12px] text-gray-400">
            <p>Duration:</p>
            <span className="text-1xl">{challenge.duration} days</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-[12px] text-gray-400">
              <p>Status</p>
              <span className="text-1xl font-extrabold text-green-600">
                {challenge.status}
              </span>
            </div>

            <div className="flex gap-4 text-gray-400">
              <div className="flex gap-4">
                <Pen size={18} strokeWidth={2} className="text-violet-600" />
                <p>Edit</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Trash2 size={18} strokeWidth={2} className="text-red-500" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg bg-white py-4 dark:bg-gray-950"
        key={challenge._id}
      >
        <div className="mx-auto grid w-[90%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between text-gray-100">
              {/* <time dateTime="2022-10-10" className="text-gray-400">
                Tuesday Feb 5
              </time> */}
              <div className="flex gap-4 text-[12px] text-gray-400">
                <p>Workout</p>
                <span className="text-1xl font-extrabold text-violet-700">
                  {challenge.workOutType}
                </span>
              </div>
            </div>
          </div>
          <div className="h-38 self-center overflow-hidden rounded-md mix-blend-plus-darker shadow-2xl shadow-gray-700">
            <img
              src={challenge.image.imageUrl}
              alt={challenge.workOutType}
              className="h-full w-full"
            />
          </div>
          <p className="text-1xl text-gray-100">{challenge.challengeName}</p>
          <p className="text-[13px] text-gray-300">{challenge.description}</p>

          <div className="flex gap-4 text-[12px] text-gray-400">
            <p>Duration:</p>
            <span className="text-1xl">{challenge.duration} days</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-[12px] text-gray-400">
              <p>Status</p>
              <span className="text-1xl font-extrabold text-green-600">
                {challenge.status}
              </span>
            </div>

            <div className="flex gap-4 text-gray-400">
              <div className="flex gap-4">
                <Pen size={18} strokeWidth={2} className="text-violet-600" />
                <p>Edit</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Trash2 size={18} strokeWidth={2} className="text-red-500" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded-lg bg-white py-4 dark:bg-gray-950"
        key={challenge._id}
      >
        <div className="mx-auto grid w-[90%] gap-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between text-gray-100">
              {/* <time dateTime="2022-10-10" className="text-gray-400">
                Tuesday Feb 5
              </time> */}
              <div className="flex gap-4 text-[12px] text-gray-400">
                <p>Workout</p>
                <span className="text-1xl font-extrabold text-violet-700">
                  {challenge.workOutType}
                </span>
              </div>
            </div>
          </div>
          <div className="h-38 self-center overflow-hidden rounded-md mix-blend-plus-darker shadow-2xl shadow-gray-700">
            <img
              src={challenge.image.imageUrl}
              alt={challenge.workOutType}
              className="h-full w-full"
            />
          </div>
          <p className="text-1xl text-gray-100">{challenge.challengeName}</p>
          <p className="text-[13px] text-gray-300">{challenge.description}</p>

          <div className="flex gap-4 text-[12px] text-gray-400">
            <p>Duration:</p>
            <span className="text-1xl">{challenge.duration} days</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4 text-[12px] text-gray-400">
              <p>Status</p>
              <span className="text-1xl font-extrabold text-green-600">
                {challenge.status}
              </span>
            </div>

            <div className="flex gap-4 text-gray-400">
              <div className="flex gap-4">
                <Pen size={18} strokeWidth={2} className="text-violet-600" />
                <p>Edit</p>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Trash2 size={18} strokeWidth={2} className="text-red-500" />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoaderGrid;
c;
