import {
    WALL_DEFAULT_COLOR,
    GREEN_MESHES,
    GREEN_COLOR,
    SOFA_MESH_COLORS,
    createStandardMaterial,
} from "./modelColors";


import * as THREE from "three";



/* ===============================
   ARM CHAIRS
================================ */

const ARM_CHAIR_COLOR = "#1328e6";

const ARM_CHAIR_MESHES = new Set([
    "Mesh7837", "Mesh7837_1", "Mesh7837_2", "Mesh7838", "Mesh7838_1", "Mesh7838_2", "Mesh7839", "Mesh7839_1",
    "Mesh7839_2", "Mesh7898", "Mesh7898_1", "Mesh7898_2", "Mesh7899", "Mesh7899_1", "Mesh7899_2", "Mesh7900",
    "Mesh7900_1", "Mesh7900_2", "Mesh7901", "Mesh7901_1", "Mesh7901_2", "Mesh7902", "Mesh7902_1", "Mesh7902_2",
    "Mesh7903", "Mesh7903_1", "Mesh7903_2", "Mesh8087", "Mesh8087_1", "Mesh8087_2", "Mesh8088", "Mesh8088_1",
    "Mesh8088_2", "Mesh8089", "Mesh8089_1", "Mesh8089_2", "Mesh8090", "Mesh8090_1", "Mesh8090_2", "Mesh8091",
    "Mesh8091_1", "Mesh8091_2", "Mesh8092", "Mesh8092_1", "Mesh8092_2", "Mesh8094", "Mesh8094_1", "Mesh8094_2",
    "Mesh8094_3", "Mesh8094_4", "Mesh8095", "Mesh8095_1", "Mesh8095_2", "Mesh8096", "Mesh8096_1", "Mesh8096_2",
    "Mesh8149", "Mesh8149_1", "Mesh8149_2", "Mesh8150", "Mesh8150_1", "Mesh8150_2", "Mesh8151", "Mesh8151_1",
    "Mesh8151_2", "Mesh8152", "Mesh8152_1", "Mesh8152_2", "Mesh8153", "Mesh8153_1", "Mesh8153_2", "Mesh8154",
    "Mesh8154_1", "Mesh8154_2",
]);

/* ===============================
   PLANTS & POTS
================================ */

const PLANT_COLOR = "#008000";   // green
const POT_COLOR = "#c0c0c0";   // grey

const PLANT_MESHES = new Set([
    "PlantMonstera005", "PlantMonstera004", "PlantMonstera001", "PlantMonstera002",
    "PlantMonstera003", "PlantMonstera006", "PlantMonstera007", "PlantMonstera010",
    "PlantMonstera011", "PlantMonstera012", "PlantMonstera013", "PlantMonstera014",
    "PlantMonstera015", "PlantMonstera016", "PlantMonstera017", "PlantMonstera018",
    "PlantMonstera019", "PlantMonstera020", "PlantMonstera021", "PlantMonstera022",
    "PlantMonstera023",
]);

const POT_MESHES = new Set([
    "Plane011", "Plane012", "Plane013", "Plane014",
    "Plane015", "Plane016", "Plane017",
]);


/* ===============================
   TABLES
================================ */

const TABLE_COLOR = "#ffffff";

const TABLE_MESHES = new Set([
    "Table001", "Table", "table", "Table002",
    "Table003", "Table004", "Table005", "table001",
    "table005", "table004", "table003", "table002",
]);


/* ===============================
   WRITING PADS
================================ */

const WRITING_PAD_COLOR = "#ffffff";

const WRITING_PAD_MESHES = new Set([
    "WT001", "WT002", "WT003", "WT004", "WT005", "WT006", "WT007", "WT008",
    "WT009", "WT010", "WT011", "WT012", "WT013", "WT014", "WT030", "WT027",
    "WT028", "WT029", "WT024", "WT025", "WT026", "WT021", "WT022", "WT023",
    "WT018", "WT019", "WT020", "WT015", "WT016", "WT017",
]);


/* ===============================
   PRINTER
================================ */

const PRINTER_WHITE_COLOR = "#5b569eff";
const PRINTER_BLACK_COLOR = "#000000";

const PRINTER_WHITE_MESHES = new Set([
    "Printer_Feet001", "Printer_Screen001",
    "Printer_Feet", "Printer_Screen",
]);

const PRINTER_BLACK_MESHES = new Set([
    "Printer_Top001", "Printer_Trays001",
    "Cube861", "Cube861_1", "Cube862", "Cube862_1",
    "Cube863", "Cube863_1", "Cube864", "Cube864_1",

    "Printer_Top", "Printer_Trays",
    "Cube853_1", "Cube854", "Cube854_1",
    "Cube855", "Cube855_1", "Cube856", "Cube856_1",
]);




/* ===============================
   PASSAGE SOFA
================================ */

const PASSAGE_SOFA_SEAT_COLOR = "#ddd1bc";
const PASSAGE_SOFA_WOOD_COLOR = "#8b5a2b"; // brown

const PASSAGE_SOFA_SEAT_MESHES = new Set([
    "Seat006", "Seat007", "Seat009", "Seat008", "Seat010", "Seat011",
    "Seat013", "Seat012", "Seat014", "Seat015", "Seat017", "Seat016",
]);

const PASSAGE_SOFA_WOOD_MESHES = new Set([
    "Wood_frame006", "Wood_frame007", "Wood_frame009", "Wood_frame008",
    "Wood_frame010", "Wood_frame011", "Wood_frame013", "Wood_frame012",
    "Wood_frame014", "Wood_frame015", "Wood_frame017", "Wood_frame016",
]);

const PASSAGE_SOFA_CUBE_MESHES = new Set([
    "Cube094", "Cube095", "Cube096", "Cube097", "Cube098", "Cube099",
    "Cube100", "Cube101", "Cube102", "Cube103",
]);


const SKIN_COLOR = "#f1c27d";

const G_OBJECT_MESHES = new Set([
    "G-Object002",
    "G-Object006",
]);



const BROWN_LINES = new Set(["Line310", "Line304", "Line303", "Line312", "Line311", "Line294", "Line293", "Line291", "Line289", "Line285", "Line283",
    "Line275", "Line276", "Line315"]);


const AHU_COLOR = "#3d3d40";
const AHU_MESHES = new Set([
    "AHU", "AHU001", "AHU002", "AHU003", "AHU004", "AHU005", "AHU006",
    "AHU007", "AHU008", "AHU009", "AHU010", "AHU011", "AHU012", "AHU013",
    "AHU014", "AHU015", "AHU016", "AHU017", "AHU018"
]);


const DUCT_COLORS = "#8A0051";
const DUCT_MESHES = new Set([
    " Line032001",
    "Line028001",
    "Line024001",
    "Line019001"
]);

const pipe_COLORS = "#f0038d";
const pipe_MESHES = new Set([

  "BOX",
  "BOX001",
  "BOX002",
  "BOX003",
  "BOX004",
  "BOX005",
  "BOX006",
  "BOX007",
  "BOX008",
  "BOX009",
  "BOX017",
  "BOX016",
  "BOX015",
  "BOX010",
  "BOX011",
  "BOX012",
  "BOX013",
  "BOX014",
  "BOX026",
  "BOX027",
  "BOX029",
  "BOX028",
  "BOX032",
  "BOX031",
  "BOX030",
  "BOX033",
  "BOX018",
  "BOX019",
  "BOX055",
  "BOX020",
  "BOX021",
  "BOX022",
  "BOX023",
  "BOX024",
  "BOX025",
  "BOX035",
  "BOX034",
  "BOX036",
  "BOX037",
  "BOX039",
  "BOX038",
  "BOX040",
  "BOX041",
  "BOX043",
  "BOX042",
  "BOX046",
  "BOX045",
  "BOX044",
  "BOX056",
  "BOX057",
  "S14a_001",
  "S14a_002",
  "S14a_003",
  "S14a_004",
  "S14a_005",
  "S14a_006",
  "S14a_007",
  "S14a_008",
  "S14a_009",
  "S14a_010",
  "S14a_011",
  "S14a_012",
  "S14a_013",
  "S14a_014",
  "S14a_015",
  "S14a_016",
  "S14a_017",
  "S14a_018",
  "S14a_019",
  "S14a_020",
  "S14a_021",
  "S14a_022",
  "S14a_023",
  "S14a_024",
  "S14a_025",
  "S14a_026",
  "S14a_027",
  "S14a_028",
  "S14a_029",
  "S14a_030",
  "S14a_031",
  "S14a_032",
  "S14a_033",
  "S14a_034",
  "S14a_035",
  "S14a_036",
  "S14a_037",
  "S14a_038",
  "S14a_039",
  "S14a_040",
  "S14a_041",
  "S14a_042",
  "S14a_043",
  "S14a_044",
  "S14a_045",
  "S14a_046",
  "S14a_047",
  "S14a_048",
  "S14a_049",
  "S14a_050",
  "S14a_051",
  "S14a_052",
  "S14a_053",
  "S14a_054",
  "S14a_055",
  "S14a_056",
  "S14a_057",
  "S14a_058",
  "S14a_059",
  "S14a_060",
  "S14a_061",
  "S14a_062",
  "S14a_063",
  "S14a_064",
  "S14a_065",
  "S14b_001",
  "S14b_002",
  "S14b_003",
  "S14b_004",
  "S14b_005",
  "S14b_006",
  "S14b_007",
  "S02b",
  "S02b001",
  "S02b002",
  "S02b003",
  "S02b004",
  "S02b005",
  "S02b006",
  "S02b007",
  "S02b008",
  "S02b009",
  "S05_001",
  "S05_002",
  "S05_003",
  "S05_004",
  "S05_005",
  "S05_006",
  "S05_007",
  "S05_008",
  "S05_009",
  "S05_010",
  "S05_011",
  "S05_012",
  "S05_013",
  "S05_014",
  "S05_015",
  "S05_016",
  "S05_017",
  "S05_018",
  "S05_019",
  "S05_020",
  "S05_021",
  "S05_022",
  "S05_023",
  "S05_024",
  "S05_025",
  "S05_026",
  "S05_027",
  "S05_028",
  "CL013",
  "CL014",
  "CL015",
  "CL012",
  "CL016",
  "CL011",
  "CL017",
  "CL010",
  "CL018",
  "CL009",
  "CL019",
  "CL008",
  "CL248",
  "CL249",
  "CL023",
  "CL024",
  "CL029",
  "CL030",
  "CL038",
  "CL039",
  "CL040",
  "CL037",
  "CL041",
  "CL036",
  "CL042",
  "CL035",
  "CL034",
  "CL033",
  "CL027",
  "CL026",
  "CL021",
  "CL483",
  "CL245",
  "CL240",
  "CL241",
  "CL247",
  "CL246",
  "CL239",
  "CL238",
  "CL001",
  "CL002",
  "CL007",
  "CL250",
  "CL251",
  "CL006",
  "CL252",
  "CL005",
  "CL253",
  "CL004",
  "CL254",
  "CL003",
  "CL225",
  "CL224",
  "CL214",
  "CL223",
  "CL226",
  "CL227",
  "CL222",
  "CL215",
  "CL228",
  "CL221",
  "CL216",
  "CL229",
  "CL220",
  "CL217",
  "CL230",
  "CL219",
  "CL218",
  "CL236",
  "CL234",
  "CL235",
  "CL237",
  "CL242",
  "CL243",
  "CL244",
  "CL233",
  "CL208",
  "CL209",
  "CL211",
  "CL210",
  "CL206",
  "CL207",
  "CL205",
  "CL212",
  "CL213",
  "CL204",
  "CL203",
  "CL202",
  "CL201",
  "CL200",
  "CL199",
  "CL198",
  "CL197",
  "CL196",
  "CL195",
  "CL194",
  "CL193",
  "CL231",
  "CL192",
  "CL191",
  "CL232",
  "CL050",
  "CL751",
  "CL752",
  "CL051",
  "CL190",
  "CL065",
  "CL189",
  "CL066",
  "CL178",
  "CL067",
  "CL177",
  "CL068",
  "CL176",
  "CL069",
  "CL175",
  "CL071",
  "CL174",
  "CL072",
  "CL173",
  "CL085",
  "CL070",
  "CL076",
  "CL077",
  "CL084",
  "CL083",
  "CL078",
  "CL075",
  "CL082",
  "CL079",
  "CL074",
  "CL081",
  "CL080",
  "CL073",
  "CL172",
  "CL145",
  "CL144",
  "CL143",
  "CL146",
  "CL171",
  "CL142",
  "CL147",
  "CL170",
  "CL141",
  "CL148",
  "CL169",
  "CL140",
  "CL149",
  "CL168",
  "CL139",
  "CL150",
  "CL167",
  "CL138",
  "CL151",
  "CL166",
  "CL137",
  "CL152",
  "CL165",
  "CL136",
  "CL153",
  "CL164",
  "CL135",
  "CL154",
  "CL163",
  "CL134",
  "CL155",
  "CL162",
  "CL133",
  "CL156",
  "CL161",
  "CL132",
  "CL157",
  "CL160",
  "CL131",
  "CL158",
  "CL159",
  "CL086",
  "CL087",
  "CL088",
  "CL089",
  "CL090",
  "CL091",
  "CL092",
  "CL125",
  "CL126",
  "CL127",
  "CL128",
  "CL129",
  "CL130",
  "D17_001",
  "D17_002",
  "D17_003",
  "D17_004",
  "D17_005",
  "D17_006",
  "D17_007",
  "D17_008",
  "D17_009",
  "D17_010",
  "D17_011",
  "D17_012",
  "D17_013",
  "D17_014",
  "D17_015",
  "D17_016",
  "D17_017",
  "D17_018",
  "D17_019",
  "D17_020",
  "D17_021",
  "D17_022",
  "CL290",
  "CL289",
  "CL288",
  "CL287",
  "CL286",
  "CL285",
  "CL284",
  "CL283",
  "CL282",
  "CL281",
  "CL280",
  "CL279",
  "CL278",
  "CL304",
  "CL307",
  "CL334",
  "CL308",
  "CL333",
  "CL303",
  "CL309",
  "CL332",
  "CL302",
  "CL310",
  "CL331",
  "CL301",
  "CL311",
  "CL330",
  "CL300",
  "CL312",
  "CL329",
  "CL299",
  "CL313",
  "CL328",
  "CL298",
  "CL327",
  "CL314",
  "CL297",
  "CL326",
  "CL315",
  "CL296",
  "CL325",
  "CL316",
  "CL295",
  "CL324",
  "CL317",
  "CL294",
  "CL323",
  "CL318",
  "CL293",
  "CL322",
  "CL319",
  "CL292",
  "CL321",
  "CL320",
  "CL291",
  "CL348",
  "CL349",
  "CL347",
  "CL346",
  "CL351",
  "CL345",
  "CL350",
  "CL344",
  "CL352",
  "CL353",
  "CL354",
  "CL343",
  "CL342",
  "CL355",
  "CL341",
  "CL356",
  "CL340",
  "CL357",
  "CL339",
  "CL358",
  "CL338",
  "CL359",
  "CL337",
  "CL360",
  "CL336",
  "CL361",
  "CL362",
  "CL365",
  "CL364",
  "CL363",
  "CL366",
  "CL367",
  "CL368",
  "CL369",
  "CL370",
  "CL371",
  "CL372",
  "CL373",
  "CL374",
  "CL375",
  "CL376",
  "CL377",
  "CL378",
  "CL379",
  "CL380",
  "CL381",
  "CL382",
  "CL383",
  "CL384",
  "CL385",
  "CL386",
  "CL387",
  "CL388",
  "CL389",
  "CL390",
  "CL391",
  "CL392",
  "CL393",
  "CL394",
  "CL395",
  "CL396",
  "CL255",
  "CL256",
  "CL258",
  "R02_004",
  "CL259",
  "CL260",
  "CL262",
  "CL261",
  "CL263",
  "CL264",
  "CL266",
  "CL267",
  "CL269",
  "CL268",
  "CL750",
  "CL749",
  "CL748",
  "CL747",
  "CL265",
  "CL257",
  "CL043",
  "CL044",
  "CL049",
  "CL048",
  "CL045",
  "CL047",
  "CL046",
  "CL055",
  "CL056",
  "CL064",
  "CL063",
  "CL057",
  "CL054",
  "CL061",
  "CL058",
  "CL053",
  "CL060",
  "CL059",
  "CL052",
  "CL406",
  "CL407",
  "CL405",
  "CL408",
  "CL402",
  "CL403",
  "CL404",
  "CL419",
  "CL417",
  "CL410",
  "CL401",
  "CL398",
  "CL397",
  "CL399",
  "CL400",
  "CL409",
  "CL411",
  "CL414",
  "CL413",
  "CL412",
  "CL415",
  "CL422",
  "CL423",
  "CL416",
  "CL421",
  "CL418",
  "CL420",
  "CL432",
  "CL431",
  "CL430",
  "CL429",
  "CL428",
  "CL427",
  "CL426",
  "CL425",
  "CL424",
  "CL433",
  "CL434",
  "CL435",
  "CL436",
  "CL437",
  "CL443",
  "CL444",
  "CL446",
  "CL445",
  "CL456",
  "CL453",
  "CL451",
  "CL448",
  "CL450",
  "CL455",
  "CL457",
  "CL454",
  "CL452",
  "CL449",
  "CL447",
  "CL442",
  "CL441",
  "CL440",
  "CL439",
  "CL438",
  "CL500",
  "CL485",
  "CL486",
  "CL487",
  "CL499",
  "CL498",
  "CL488",
  "CL489",
  "CL490",
  "CL497",
  "CL496",
  "CL491",
  "CL492",
  "CL495",
  "CL494",
  "CL506",
  "CL507",
  "CL508",
  "CL509",
  "CL510",
  "CL512",
  "CL501",
  "CL502",
  "CL503",
  "CL504",
  "CL505",
  "CL511",
  "CL484",
  "CL482",
  "CL481",
  "CL480",
  "CL479",
  "CL478",
  "CL477",
  "CL476",
  "CL475",
  "CL474",
  "CL473",
  "CL472",
  "CL464",
  "CL461",
  "CL462",
  "CL463",
  "CL465",
  "CL459",
  "CL460",
  "CL458",
  "CL468",
  "CL466",
  "CL467",
  "CL471",
  "CL470",
  "CL469",
  "CL513",
  "CL521",
  "CL520",
  "CL514",
  "CL519",
  "CL515",
  "CL522",
  "CL523",
  "CL524",
  "CL527",
  "CL526",
  "CL525",
  "CL528",
  "CL529",
  "CL530",
  "CL516",
  "CL517",
  "CL518",
  "CL531",
  "CL532",
  "CL544",
  "CL543",
  "CL744",
  "CL572",
  "CL533",
  "CL542",
  "CL541",
  "CL534",
  "CL540",
  "CL535",
  "CL539",
  "CL536",
  "CL538",
  "CL537",
  "CL571",
  "CL570",
  "CL559",
  "CL545",
  "CL546",
  "CL569",
  "CL547",
  "CL568",
  "CL567",
  "CL560",
  "CL566",
  "CL561",
  "CL563",
  "CL562",
  "CL564",
  "CL579",
  "CL578",
  "CL577",
  "CL565",
  "CL576",
  "CL575",
  "CL574",
  "CL573",
  "CL550",
  "CL549",
  "CL548",
  "CL551",
  "CL552",
  "CL553",
  "CL554",
  "CL555",
  "CL556",
  "CL557",
  "CL558",
  "CL580",
  "CL584",
  "CL585",
  "CL586",
  "CL587",
  "CL583",
  "CL588",
  "CL582",
  "CL581",
  "CL589",
  "CL590",
  "CL592",
  "CL591",
  "CL593",
  "CL594",
  "CL596",
  "CL595",
  "CL597",
  "CL613",
  "CL610",
  "CL612",
  "CL611",
  "CL614",
  "CL615",
  "CL618",
  "CL617",
  "CL616",
  "CL619",
  "CL620",
  "CL623",
  "CL621",
  "CL624",
  "CL625",
  "CL628",
  "CL626",
  "CL627",
  "CL641",
  "CL642",
  "CL640",
  "CL629",
  "CL639",
  "CL630",
  "CL631",
  "CL638",
  "CL632",
  "CL637",
  "CL633",
  "CL636",
  "CL634",
  "CL635",
  "CL671",
  "CL672",
  "CL673",
  "CL674",
  "CL675",
  "CL676",
  "CL677",
  "CL678",
  "CL679",
  "CL680",
  "CL682",
  "CL683",
  "CL681",
  "CL684",
  "CL685",
  "CL686",
  "CL687",
  "CL688",
  "CL689",
  "CL690",
  "CL691",
  "CL693",
  "CL692",
  "CL694",
  "CL696",
  "CL695",
  "CL698",
  "CL697",
  "CL699",
  "CL701",
  "CL700",
  "CL702",
  "CL703",
  "CL706",
  "CL704",
  "CL707",
  "CL715",
  "CL705",
  "CL714",
  "CL713",
  "CL712",
  "CL711",
  "CL708",
  "CL710",
  "CL709",
  "CL650",
  "CL649",
  "CL648",
  "CL647",
  "CL646",
  "CL645",
  "CL644",
  "CL643",
  "CL656",
  "CL655",
  "CL654",
  "CL653",
  "CL651",
  "CL652",
  "CL657",
  "CL658",
  "CL659",
  "CL660",
  "CL661",
  "CL663",
  "CL662",
  "CL670",
  "CL669",
  "CL668",
  "CL667",
  "CL666",
  "CL664",
  "CL665",
  "CL599",
  "CL745",
  "CL746",
  "CL598",
  "CL600",
  "CL601",
  "CL603",
  "CL602",
  "CL604",
  "CL605",
  "CL607",
  "CL606",
  "CL608",
  "CL609",
  "S15_004",
  "S15_005",
  "S15_006",
  "S02b_001",
  "S02b_002",
  "CL186",
  "CL187",
  "CL188",
  "CL185",
  "CL184",
  "CL183",
  "CL181",
  "CL180",
  "CL179",
  "CL182",
  "CL276",
  "CL277",
  "CL274",
  "CL275",
  "CL273",
  "CL272",
  "CL270",
  "CL271",
  "CL335",
  "CL306",
  "CL305",
  "CL022",
  "CL025",
  "CL028",
  "CL032",
  "CL716",
  "CL717",
  "CL718",
  "CL719",
  "CL720",
  "CL721",
  "CL722",
  "CL723",
  "CL724",
  "CL725",
  "CL726",
  "CL727",
  "CL728",
  "CL729",
  "CL730",
  "CL731",
  "CL732",
  "CL733",
  "CL734",
  "CL735",
  "CL736",
  "CL737",
  "CL738",
  "CL739",
  "CL740",
  "CL741",
  "CL742",
  "CL743",
  "CL020",
  "Sensor121",
  "Sensor002",
  "Sensor004",
  "Sensor003",
  "Sensor005",
  "Sensor006",
  "Sensor008",
  "Sensor007",
  "Sensor014",
  "Sensor013",
  "Sensor010",
  "Sensor011",
  "Sensor012",
  "Sensor020",
  "Sensor021",
  "Sensor016",
  "Sensor015",
  "Sensor018",
  "Sensor159",
  "Sensor160",
  "Sensor019",
  "Sensor022",
  "Sensor161",
  "Sensor033",
  "Sensor051",
  "Sensor050",
  "Sensor035",
  "Sensor049",
  "Sensor037",
  "Sensor048",
  "Sensor038",
  "Sensor047",
  "Sensor040",
  "Sensor046",
  "Sensor042",
  "Sensor044",
  "Sensor043",
  "Sensor045",
  "Sensor041",
  "Sensor039",
  "Sensor036",
  "Sensor034",
  "Sensor052",
  "Sensor053",
  "Sensor054",
  "Sensor055",
  "Sensor056",
  "Sensor057",
  "Sensor058",
  "Sensor059",
  "Sensor024",
  "Sensor060",
  "Sensor061",
  "Sensor062",
  "Sensor083",
  "Sensor082",
  "Sensor063",
  "Sensor064",
  "Sensor065",
  "Sensor066",
  "Sensor068",
  "Sensor069",
  "Sensor070",
  "Sensor071",
  "Sensor072",
  "Sensor073",
  "Sensor074",
  "Sensor075",
  "Sensor076",
  "Sensor097",
  "Sensor096",
  "Sensor095",
  "Sensor094",
  "Sensor093",
  "Sensor092",
  "Sensor091",
  "Sensor090",
  "Sensor089",
  "Sensor088",
  "Sensor084",
  "Sensor085",
  "Sensor086",
  "Sensor087",
  "Sensor081",
  "Sensor079",
  "Sensor080",
  "Sensor078",
  "Sensor077",
  "Sensor098",
  "Sensor099",
  "Sensor100",
  "Sensor101",
  "Sensor103",
  "Sensor102",
  "Sensor105",
  "Sensor104",
  "Sensor106",
  "Sensor107",
  "Sensor108",
  "Sensor109",
  "Sensor110",
  "Sensor111",
  "Sensor112",
  "Sensor113",
  "Sensor114",
  "Sensor115",
  "Sensor116",
  "Sensor118",
  "Sensor117",
  "Sensor119",
  "Sensor120",
  "Sensor",
  "Sensor001",
  "Sensor009",
  "Sensor122",
  "Sensor123",
  "Sensor124",
  "Sensor125",
  "Sensor126",
  "Sensor127",
  "Sensor128",
  "Sensor129",
  "Sensor130",
  "Sensor132",
  "Sensor131",
  "Sensor134",
  "Sensor135",
  "Sensor136",
  "Sensor137",
  "Sensor138",
  "Sensor140",
  "Sensor139",
  "Sensor141",
  "Sensor142",
  "Sensor144",
  "Sensor143",
  "Sensor145",
  "Sensor146",
  "Sensor148",
  "Sensor147",
  "Sensor149",
  "Sensor150",
  "Sensor152",
  "Sensor151",
  "Sensor153",
  "Sensor154",
  "Sensor156",
  "Sensor155",
  "Sensor158",
  "Sensor157",
  "white_chandelier029",
  "SL028",
  "white_chandelier001",
  "SL001",
  "white_chandelier002",
  "SL002",
  "white_chandelier003",
  "SL003",
  "white_chandelier004",
  "SL004",
  "white_chandelier005",
  "SL005",
  "white_chandelier006",
  "SL006",
  "white_chandelier007",
  "SL007",
  "white_chandelier008",
  "SL008",
  "white_chandelier009",
  "SL009",
  "white_chandelier010",
  "SL010",
  "white_chandelier011",
  "SL011",
  "white_chandelier012",
  "SL012",
  "white_chandelier013",
  "SL013",
  "white_chandelier014",
  "SL014",
  "ELL020",
  "ELL019",
  "Sensor023",
  "R03_035001",
  "R03_035002",
  "R03_035003",
  "R03_035004",
  "R03_035005",
  "R03_035006",
  "R03_035007",
  "R03_035008",
  "R03_035009",
  "R03_035010",
  "R03_035011",
  "R03_035012",
  "R03_035013",
  "S02b005001",
  "S02b005002",
  "S02b009001",
  "S02b009002",
  "S02b009003",
  "S02b009004",
  "S02b009005",
  "S02b009006",
  "S02b009007",
  "S02b009008",
  "S02b009009",
  "S02b009010",
  "S02b009011",
  "S02b009012",
  "S02b009013",
  "S02b009014",
  "S02b009015",
  "S02b009016",
  "white_chandelier015",
  "SL015",
  "white_chandelier016",
  "SL016",
  "white_chandelier017",
  "SL017",
  "white_chandelier018",
  "SL018",
  "white_chandelier019",
  "SL019",
  "white_chandelier020",
  "SL020",
  "white_chandelier021",
  "SL021",
  "white_chandelier022",
  "SL022",
  "white_chandelier023",
  "SL023",
  "white_chandelier024",
  "white_chandelier025",
  "SL024",
  "SL025",
  "white_chandelier026",
  "white_chandelier027",
  "SL026",
  "SL027",
  "white_chandelier028",
  "SL029",
  "white_chandelier030",
  "SL030",
  "white_chandelier031",
  "white_chandelier032",
  "SL031",
  "SL032",
  "white_chandelier033",
  "white_chandelier034",
  "SL033",
  "SL034",
  "white_chandelier1",
  "SL",
  "white_chandelier035",
  "SL035",
  "white_chandelier036",
  "SL036",
  "Cube526",
  "Cube526_1",
  "ALL004",
  "Sensor133",
  "CL493",
  "CL",
  "CL031",
  "CL062",
  "Sensor017",
  "CL093",
  "Sensor025",
  "Sensor026",
  "Sensor027",
  "Sensor028",
  "Sensor029",
  "Sensor030",
  "Sensor031",
  "Sensor032",
  "RL005",
  "LL010",
  "LL011",
  "LL012",
  "CL094",
  "CL095",
  "CL096",
  "CL097",
  "CL098",
  "CL099",
  "CL100",
  "CL101",
  "CL102",
  "CL103",
  "CL104",
  "CL105",
  "CL106",
  "CL107",
  "CL108",
  "CL109",
  "CL110",
  "CL111",
  "CL112",
  "CL113",
  "CL114",
  "CL115",
  "CL116",
  "CL117",
  "CL118",
  "CL119",
  "CL120",
  "CL121",
  "CL122",
  "CL123",
  "CL124",
  "BOX047",
  "BOX048",
  "BOX049",
  "BOX050",
  "BOX051",
  "BOX054",
  "BOX052",
  "BOX053",
  "ALL010",
  "ALL011",
  "CL622",
  "Sensor067",
  "LL226",
  "LL225",
  "ALL016",
  "ALL015",
  "LL001",
  "LL002",
  "S02b005005",
  "S02b005003",
  "S02b005004",
  "S02b005006",
  "Sensor162"



]);





/* ===============================
   APPLY COLORS ONLY
================================ */
export function applyColors({ obj, floorMaterial }) {
    if (!obj.isMesh) return;

    const name = obj.name?.trim();
    if (!name) return;

    /* 🟫 FLOOR (PNG TEXTURE) */
    if (name === "Floor") {
        disposeMaterial(obj);
        obj.material = floorMaterial;
        obj.material.needsUpdate = true;
        obj.receiveShadow = true;
        obj.castShadow = false;
        return;
    }

    /* 🟢 GREEN MESHES *///
    if (GREEN_MESHES.has(name)) {
        obj.material = createStandardMaterial(GREEN_COLOR, 0.5, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🛋️ SOFA + SOFA STAND */
    if (SOFA_MESH_COLORS[name]) {
        obj.material = createStandardMaterial(
            SOFA_MESH_COLORS[name],
            SOFA_MESH_COLORS[name] === "#000000" ? 0.7 : 0.5,
            0.0
        );
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🔴 BOXES */
    if (name.toLowerCase().startsWith("box")) {
        obj.material = createStandardMaterial("#f0f0f0", 0.5, 0.1);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🧱 WALLS */
    if (name.toLowerCase().startsWith("wall")) {
        obj.material = createStandardMaterial(WALL_DEFAULT_COLOR, 0.6, 0.0);
        return;
    }

    /* 🚪 DOORS */
    if (name.toLowerCase().startsWith("pivotdoor")) {
        obj.material = createStandardMaterial("#ffffff", 0.6, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

      if (pipe_MESHES.has(name)) {
        obj.material = createStandardMaterial(
            pipe_COLORS,
            0.35,
            0.08
        );
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    
      if (pipe_MESHES.has(name)) {
        obj.material = createStandardMaterial(
            pipe_COLORS,
            0.35,
            0.08
        );
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }


    /* 🪑 ARM CHAIRS */
    if (ARM_CHAIR_MESHES.has(name)) {
        obj.material = createStandardMaterial(ARM_CHAIR_COLOR, 0.55, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🌿 PLANTS */
    if (PLANT_MESHES.has(name)) {
        obj.material = createStandardMaterial(PLANT_COLOR, 0.7, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🪴 PLANT POTS */
    if (POT_MESHES.has(name)) {
        obj.material = createStandardMaterial(POT_COLOR, 0.5, 0.1);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }


    /* 🪑 TABLES */
    if (TABLE_MESHES.has(name)) {
        obj.material = createStandardMaterial(TABLE_COLOR, 0.4, 0.05);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }



    /* 📝 WRITING PADS */
    if (WRITING_PAD_MESHES.has(name)) {
        obj.material = createStandardMaterial(WRITING_PAD_COLOR, 0.35, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }


    /* 🖨️ PRINTER (WHITE PARTS) */
    if (PRINTER_WHITE_MESHES.has(name)) {
        obj.material = createStandardMaterial(PRINTER_WHITE_COLOR, 0.4, 0.05);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🖨️ PRINTER (BLACK PARTS) */
    if (PRINTER_BLACK_MESHES.has(name)) {
        obj.material = createStandardMaterial(PRINTER_BLACK_COLOR, 0.6, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }


    /* 🛋️ PASSAGE SOFA – SEAT */
    if (PASSAGE_SOFA_SEAT_MESHES.has(name)) {
        obj.material = createStandardMaterial(PASSAGE_SOFA_SEAT_COLOR, 0.55, 0.0);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🪵 PASSAGE SOFA – WOOD FRAME */
    if (PASSAGE_SOFA_WOOD_MESHES.has(name)) {
        obj.material = createStandardMaterial(PASSAGE_SOFA_WOOD_COLOR, 0.6, 0.1);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    /* 🧱 PASSAGE SOFA – SUPPORT CUBES */
    if (PASSAGE_SOFA_CUBE_MESHES.has(name)) {
        obj.material = createStandardMaterial(PASSAGE_SOFA_WOOD_COLOR, 0.6, 0.1);
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }


    if (G_OBJECT_MESHES.has(name)) {
        obj.material = createStandardMaterial(
            SKIN_COLOR,
            0.42,
            0.0
        );
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

    if (AHU_MESHES.has(name)) {
        obj.material = createStandardMaterial(
            AHU_COLOR,
            0.35,
            0.08
        );
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }



    if (DUCT_MESHES.has(name)) {
        obj.material = createStandardMaterial(
            DUCT_COLORS,
            0.35,
            0.08
        );
        obj.castShadow = true;
        obj.receiveShadow = true;
        return;
    }

     



}

/* ===============================
   HELPER
================================ */
function disposeMaterial(obj) {
    if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose());
    } else {
        obj.material?.dispose();
    }
}
