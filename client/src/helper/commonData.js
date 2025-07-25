const stateCityData = {
  tamilnadu: ["Chennai", "Coimbatore", "Madurai", "Trichy"],
  kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
  andhra: ["Vijayawada", "Visakhapatnam", "Guntur"],
};
const genderOptions = [
  { value: "", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];


const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export { stateCityData, SUPPORTED_TYPES, MAX_FILE_SIZE , genderOptions };
