import { useState } from "react";
import toast from "react-hot-toast";
import {
  useDeleteTeacherMutation,
} from "../redux/features/teachers/teachersApi";
import { useDeleteStudentMutation } from "../redux/features/students/studentsApi";
import { useDeleteClassMutation } from "../redux/features/class/classApi";
import { useDeleteSubjectMutation } from "../redux/features/subject/subjectApi";
import { useDeleteExamMutation } from "../redux/features/exam/examApi";

import TeacherForm from "./forms/TeacherForm";
import StudentForm from "./forms/StudentForm";
import SubjectForm from "./forms/SubjectForm";
import ClassForm from "./forms/ClassForm";
import ExamForm from "./forms/ExamForm";

import { Plus, Edit2, Trash2, X } from "lucide-react";

interface FormModalProps {
  table: string;
  type: "create" | "update" | "delete";
  data?: unknown;
  id?: string;
  relatedData?: unknown;
  onConfirmDelete?: () => void;
  isDeleting?: boolean;
}

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
  onConfirmDelete,
  isDeleting,
}: FormModalProps) => {
  const [open, setOpen] = useState(false);

  // RTK delete mutations
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [deleteStudent] = useDeleteStudentMutation();
  const [deleteClass] = useDeleteClassMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [deleteExam] = useDeleteExamMutation();

  const deleteMap: Record<string, unknown> = {
    teacher: deleteTeacher,
    student: deleteStudent,
    class: deleteClass,
    subject: deleteSubject,
    exam: deleteExam,
  };

  const handleDelete = async () => {
    if (!id) return toast.error("Invalid record ID");
    try {
      const deleteFn = deleteMap[table];
      if (deleteFn) await deleteFn(id).unwrap();
      toast.success(`${table} deleted successfully`);
      setOpen(false);
      if (onConfirmDelete) onConfirmDelete();
    } catch {
      toast.error(`Failed to delete ${table}`);
    }
  };

  const renderForm = () => {
    switch (table) {
      case "teacher":
        return <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />;
      case "student":
        return <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />;
      case "subject":
        return <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />;
      case "class":
        return <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />;
      case "exam":
        return <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />;
      default:
        return <p>Form not found!</p>;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "create":
        return <Plus size={16} />;
      case "update":
        return <Edit2 size={16} />;
      case "delete":
        return <Trash2 size={16} />;
      default:
        return <Plus size={16} />;
    }
  };

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  return (
    <>
      {/* Trigger button */}
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
        disabled={isDeleting}
      >
        {getIcon()}
      </button>

      {/* Modal */}
      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            {type === "delete" ? (
              <div className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">
                  All data will be lost. Are you sure you want to delete this {table}?
                </span>
                <button
                  onClick={handleDelete}
                  className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            ) : (
              renderForm()
            )}

            {/* Close button */}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
