import { detectHeadlines } from "./detectHeadlines";

test("Detect headlines", () => {
  expect(detectHeadlines({ rows: [] })).toBe(0);
  expect(detectHeadlines({ rows: rows1 })).toBe(2);
  expect(detectHeadlines({ rows: rows2 })).toBe(2);
});

const rows1 = [
  [
    "ID",
    "sdf DFs sdf",
    "Jf lsdf sdfj sdfl sdf",
    "JS sll JSkdkppk  DJFLldf",
    "kldks kdkJ llSD F sd fsdf ",
    "lls sf sls dfs dflsdfls ",
  ],
  ["ID", "A-001", "B-002", "C-003", "D-004", "E-005"],
  [
    "2222222222239",
    "sdfsadfasdfafsddsf",
    "TRUE",
    "N-91649",
    "1166-46-7",
    "65-85-0\r\n71-23-8",
    "lsdfksdf ... sdf sdf  slll sdf sdflsdflsdfk sldkfiwiehsnoofsppwih lsdkfh i",
  ],
  ["2222222222222", "Salatöl", "FALSE", "N/A", "N/A", "N/A"],
  [
    "4004675000019",
    "Fobartasche",
    "TRUE\r\n",
    "N-99887",
    "3322-55-1",
    "23-43-8, 12-23-3",
  ],
  [
    "4004273000036",
    "Nasenduschwasser",
    "ja",
    "N-33223",
    "3322-55-2",
    "44-55-6\r\n22-33-4\r\n11-22-3",
  ],
  ["4004675000040", "Superblue", "yes", "N-12344", "3322-55-3", "77-45-3"],
  [],
  [],
  [],
  [],
  [],
];

const rows2 = [
  [
    "sdf DFs sdf",
    "Jf lsdf sdfj sdfl sdf",
    "JS sll JSkdkppk  DJFLldf",
    "kldks kdkJ llSD F sd fsdf ",
    "lls sf sls dfs dflsdfls ",
  ],
  ["ID", "A-001", "B-002", "C-003", "D-004", "E-005"],
  [
    "sdfsadfasdfafsddsf",
    "TRUE",
    "N-91649",
    "1166-46-7",
    "65-85-0\r\n71-23-8",
    "lsdfksdf ... sdf sdf  slll sdf sdflsdflsdfk sldkfiwiehsnoofsppwih lsdkfh i",
  ],
  ["Salatöl", "FALSE", "N/A", "N/A", "N/A"],
  ["Fobartasche", "TRUE\r\n", "N-99887", "3322-55-1", "23-43-8, 12-23-3"],
  [
    "Nasenduschwasser",
    "ja",
    "N-33223",
    "3322-55-2",
    "44-55-6\r\n22-33-4\r\n11-22-3",
  ],
  ["Superblue", "yes", "N-12344", "3322-55-3", "77-45-3"],
  [],
  [],
  [],
  [],
  [],
];
