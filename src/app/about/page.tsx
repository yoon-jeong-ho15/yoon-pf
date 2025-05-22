import Education from "./ui/education";
import Project from "./ui/project";

export default function Page() {
  return (
    <div className="flex justify-center">
      <div className="mt-4 grid grid-cols-3 w-[90%]">
        <div className="col-span-2 p-4 bg-gray-100 rounded-lg mx-1">
          <h1>Project</h1>
          <Project />
        </div>
        <div className="row-span-2 p-4 bg-gray-100 rounded-lg mx-1">
          <h1>Education</h1>
          <Education />
        </div>
      </div>
    </div>
  );
}
