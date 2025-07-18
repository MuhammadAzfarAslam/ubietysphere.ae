import FormButton from "@/components/button/FormButton";

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

      <form className="space-y-4">
        <div>
          <label
            for="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value="John"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            for="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value="Doe"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label for="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value="john.doe@example.com"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            for="profession"
            className="block text-sm font-medium text-gray-700"
          >
            Profession
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            value="Software Developer"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <FormButton>Update</FormButton>
        </div>
      </form>
    </div>
  );
}
