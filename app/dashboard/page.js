import FormButton from "@/components/button/FormButton";
import GeneralForm from "@/components/form/GeneralForm";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile Picture"
          className="rounded-full w-24 h-24"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">General Info</h2>
          <p className="text-gray-500">Update your details below</p>
        </div>
      </div>

      <GeneralForm />
    </div>
  );
}
