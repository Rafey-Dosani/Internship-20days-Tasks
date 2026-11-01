export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUser(value: unknown): value is User {
  if (!isRecord(value) || !isRecord(value.address) || !isRecord(value.company)) {
    return false;
  }

  const address = value.address;
  const company = value.company;

  return (
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.username === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    typeof value.website === "string" &&
    typeof address.street === "string" &&
    typeof address.suite === "string" &&
    typeof address.city === "string" &&
    typeof address.zipcode === "string" &&
    isRecord(address.geo) &&
    typeof address.geo.lat === "string" &&
    typeof address.geo.lng === "string" &&
    typeof company.name === "string" &&
    typeof company.catchPhrase === "string" &&
    typeof company.bs === "string"
  );
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(USERS_API_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load users (request failed with ${response.status}).`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isUser)) {
    throw new Error("The users service returned data in an unexpected format.");
  }

  return data;
}

export async function getUserById(id: number): Promise<User | null> {
  const response = await fetch(`${USERS_API_URL}/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to load this profile (request failed with ${response.status}).`);
  }

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("The users service returned data in an unexpected format.");
  }

  return data;
}
