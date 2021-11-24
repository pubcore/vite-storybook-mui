import faker from "faker";
import { writeFileSync } from "fs";

writeFileSync(
  "./testRows.json",
  JSON.stringify(
    new Array(10000).fill(null).map((_, index) => ({
      id: index + 1,
      name: faker.name.findName(),
      email: faker.internet.email(),
      zip: faker.address.zipCode(),
      city: faker.address.city(),
      date: faker.date.past(),
    }))
  ),
  "utf8"
);
