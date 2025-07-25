"use client";

export default function Cancle() {
  return (
    <button
      type="button"
      onClick={() => history.back()}
      className="bg-red-500 hover:bg-red-600 
  text-white font-medium px-6 py-2 rounded-lg
  text-lg shadow-md"
    >
      취소하기
    </button>
  );
}
