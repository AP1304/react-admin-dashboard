export const fetchUsers = async () => {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch users"
    );
  }

  return response.json();
};