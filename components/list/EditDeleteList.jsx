import React from "react";

const EditDeleteList = ({ id, title = "title", fieldOfStudy="", fileName, deleteHandler, editHandler, shareHandler, showShare = false }) => {
  return (
    <div className="w-full bg-primary shadow-lg rounded-sm p-3 flex justify-between items-center">
      {/* Left Title */}
      <div className="text-lg  text-white">
        {fieldOfStudy} - {title}
      </div>

      {/* Right Icons */}
      <div className="flex space-x-4">
        {/* Share Icon - Only show if showShare is true */}
        {showShare && fileName && (
          <button
            onClick={() => shareHandler(id)}
            className="text-white cursor-pointer hover:text-green-600"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24896 15.0227 5.36964L8.08331 9.73036C7.54305 9.27806 6.80851 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80851 15 7.54305 14.7219 8.08331 14.2696L15.0227 18.6304C15.0077 18.751 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.1915 16 16.457 16.2781 15.9167 16.7304L8.97727 12.3696C8.99234 12.249 9 12.1255 9 12C9 11.8745 8.99234 11.751 8.97727 11.6304L15.9167 7.26964C16.457 7.72194 17.1915 8 18 8Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        
        <button className="text-gray-500 cursor-pointer hover:text-blue-600" onClick={()=>editHandler(id)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3448 14.9997H2.95567C1.33005 14.9997 0 13.6697 0 12.044V4.65488C0 3.02927 1.33005 1.69922 2.95567 1.69922H5.17241C5.61576 1.69922 5.91133 1.99479 5.91133 2.43814C5.91133 2.88148 5.61576 3.17705 5.17241 3.17705H2.95567C2.14286 3.17705 1.47783 3.84208 1.47783 4.65488V12.044C1.47783 12.8569 2.14286 13.5219 2.95567 13.5219H10.3448C11.1576 13.5219 11.8227 12.8569 11.8227 12.044V9.8273C11.8227 9.38395 12.1182 9.08838 12.5616 9.08838C13.0049 9.08838 13.3005 9.38395 13.3005 9.8273V12.044C13.3005 13.6697 11.9704 14.9997 10.3448 14.9997Z"
              fill="#ffffff"
            />
            <path
              d="M7.97976 9.82893H5.91079C5.46744 9.82893 5.17188 9.53337 5.17188 9.09002V7.02105C5.17188 6.79938 5.24577 6.65159 5.39355 6.50381L9.60537 2.29199C9.75316 2.1442 9.90094 2.07031 10.1226 2.07031C10.3443 2.07031 10.4921 2.1442 10.6399 2.29199L12.7088 4.36095C13.0044 4.65652 13.0044 5.09987 12.7088 5.39544L8.497 9.60726C8.34922 9.75504 8.20143 9.82893 7.97976 9.82893ZM6.64971 8.3511H7.68419L11.1571 4.87819L10.1226 3.84371L6.64971 7.31662V8.3511Z"
              fill="#ffffff"
            />
            <path
              d="M12.1907 5.61576C11.969 5.61576 11.8212 5.54187 11.6735 5.39409L9.60449 3.32512C9.30892 3.02956 9.30892 2.58621 9.60449 2.29064L11.6735 0.221675C11.969 -0.0738916 12.4124 -0.0738916 12.7079 0.221675L14.7769 2.29064C15.0725 2.58621 15.0725 3.02956 14.7769 3.32512L12.7079 5.39409C12.5602 5.54187 12.4124 5.61576 12.1907 5.61576ZM11.1562 2.80788L12.1907 3.84236L13.2252 2.80788L12.1907 1.7734L11.1562 2.80788Z"
              fill="#ffffff"
            />
          </svg>
        </button>
        <button className="text-gray-500 cursor-pointer hover:text-red-600" onClick={()=>deleteHandler(id)}>
          <svg
            width="19"
            height="20"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3.55859H13"
              stroke="#FF0000"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6615 3.55859V12.8919C11.6615 13.5586 10.9948 14.2253 10.3281 14.2253H3.66146C2.99479 14.2253 2.32812 13.5586 2.32812 12.8919V3.55859"
              stroke="#FF0000"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.33203 3.55729V2.22396C4.33203 1.55729 4.9987 0.890625 5.66536 0.890625H8.33203C8.9987 0.890625 9.66536 1.55729 9.66536 2.22396V3.55729"
              stroke="#FF0000"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.66797 6.89062V10.8906"
              stroke="#FF0000"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.33203 6.89062V10.8906"
              stroke="#FF0000"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EditDeleteList;
