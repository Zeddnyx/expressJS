export default function hideEmails(obj: any): void {
  // find email inside infinite array of object then hide it
  if (Array.isArray(obj)) {
    obj.forEach((item) => hideEmails(item));
  } else if (typeof obj === "object" && obj !== null) {
    if (obj.hasOwnProperty("email")) {
      obj.email = undefined;
    }
    Object.values(obj).forEach((value) => hideEmails(value));
  }
}

