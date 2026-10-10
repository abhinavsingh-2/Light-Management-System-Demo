// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Box,
// } from "@mui/material";

// /* =========================================================
//    FAILURE CARD (UI UNCHANGED – PURE DISPLAY)
// ========================================================= */

// const TOTAL_COUNT = 100; // 🔧 Change if needed
// const ROYAL_BLUE = "#4169E1"; // Royal Blue

// const FailureCard = ({ label, value }) => {

//   console.log("🧠 FAILURE CARD DISPLAY VALUE:", value);

//   const numeric = Number(value);
//   const isValid = value != null && !isNaN(numeric);

//   const percent = isValid
//     ? Math.min((numeric / TOTAL_COUNT) * 100, 100)
//     : 0;

//   return (
//     <Card
//       sx={{
//         textAlign: "center",
//         width: "100%",
//         maxWidth: 340,
//         borderRadius: 2,
//         minHeight: 376,
//         cursor: "pointer",
//         transition: "all 0.3s ease",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         py: 2,
//         px: 1.5,
//         mt: 5,
//         backgroundColor: "transparent",
//         border: "2px solid rgba(255, 255, 255, 0.8)",
//         boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
//         margin: "auto",
//       }}
//     >
//       <CardContent
//         sx={{
//           padding: 0,
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Box
//           position="relative"
//           sx={{
//             width: "80%",
//             maxWidth: 220,
//             aspectRatio: "1",
//             margin: "0 auto",
//             marginBottom: "14px",
//           }}
//         >
//           {/* Background Ring */}
//           <CircularProgress
//             variant="determinate"
//             value={100}
//             size="100%"
//             thickness={4}
//             sx={{
//               color: "rgba(65,105,225,0.2)", // soft royal blue trail
//               position: "absolute",
//               top: 0,
//               left: 0,
//             }}
//           />

//           {/* Foreground Ring */}
//           <CircularProgress
//             variant="determinate"
//             value={percent}
//             size="100%"
//             thickness={4}
//             sx={{
//               color: ROYAL_BLUE,
//               position: "absolute",
//               top: 0,
//               left: 0,
//             }}
//           />

//           {/* CENTER TEXT */}
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             sx={{
//               width: "58%",
//               height: "58%",
//               transform: "translate(-50%, -50%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Typography
//               component="div"
//               fontWeight={600}
//               sx={{
//                 fontSize: "clamp(22px, 5vw, 34px)",
//                 color: "#000",
//                 lineHeight: 1,
//                 textAlign: "center",
//               }}
//             >
//               {!isValid ? "No Data" : numeric}
//             </Typography>
//           </Box>
//         </Box>

//         <Typography
//           variant="body1"
//           sx={{
//             mt: 1,
//             fontWeight: 500,
//             color: "#000",
//             fontSize: "clamp(13px, 2vw, 18px)",
//             textAlign: "center",
//           }}
//         >
//           {label}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// /* =========================================================
//    MAIN PAGE FAILURES COLUMN (NO ROOM LOGIC)
// ========================================================= */

// export default function FailuresColumn() {

//   const [failureValue, setFailureValue] = useState(null);

//   useEffect(() => {

//     const handler = (e) => {
//       const { key, value } = e.detail || {};

//       console.groupCollapsed("📥 MAIN FAILURE RX (React)");
//       console.log("Key:", key);
//       console.log("Value:", value);
//       console.groupEnd();

//       if (key === "failureStatus") {
//         setFailureValue(value);
//       }
//     };

//     window.addEventListener("niagara-main-failure-update", handler);

//     return () =>
//       window.removeEventListener("niagara-main-failure-update", handler);

//   }, []);

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       width="100%"
//       maxWidth={340}
//       sx={{ padding: "16px 0", margin: "auto" }}
//     >
//       <FailureCard
//         label="Total Driver Fault"
//         value={failureValue}
//       />
//     </Box>
//   );
// }




import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

/* =========================================================
   FAILURE CARD (UI UNCHANGED – NOW DYNAMIC TOTAL)
========================================================= */

const ROYAL_BLUE = "#4169E1";

const FailureCard = ({ label, value, total }) => {

  console.log("🧠 FAILURE CARD DISPLAY:", value, "/", total);

  const numeric = Number(value);
  const totalNum = Number(total);

  const isValid =
    value != null &&
    total != null &&
    !isNaN(numeric) &&
    !isNaN(totalNum) &&
    totalNum > 0;

  const percent = isValid
    ? Math.min((numeric / totalNum) * 100, 100)
    : 0;

  return (
    <Card
      sx={{
        textAlign: "center",
        width: "100%",
        maxWidth: 340,
        borderRadius: 2,
        minHeight: 376,
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        px: 1.5,
        mt: 5,
        backgroundColor: "transparent",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        margin: "auto",
      }}
    >
      <CardContent
        sx={{
          padding: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          position="relative"
          sx={{
            width: "80%",
            maxWidth: 220,
            aspectRatio: "1",
            margin: "0 auto",
            marginBottom: "14px",
          }}
        >
          {/* Background Ring */}
          <CircularProgress
            variant="determinate"
            value={100}
            size="100%"
            thickness={4}
            sx={{
              color: "rgba(65,105,225,0.2)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Foreground Ring */}
          <CircularProgress
            variant="determinate"
            value={percent}
            size="100%"
            thickness={4}
            sx={{
              color: ROYAL_BLUE,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* CENTER TEXT */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              width: "58%",
              height: "58%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              component="div"
              fontWeight={600}
              sx={{
                fontSize: "clamp(22px, 5vw, 34px)",
                color: "#000",
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              {!isValid ? "No Data" : `${numeric} / ${totalNum}`}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            mt: 1,
            fontWeight: 500,
            color: "#000",
            fontSize: "clamp(13px, 2vw, 18px)",
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

/* =========================================================
   MAIN PAGE FAILURES COLUMN
========================================================= */

export default function FailuresColumn() {

  const [failureValue, setFailureValue] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {

    const handler = (e) => {
      const { failure, total } = e.detail || {};

      console.groupCollapsed("📥 MAIN FAILURE RX (React)");
      console.log("Failure:", failure);
      console.log("Total:", total);
      console.groupEnd();

      if (failure != null) setFailureValue(failure);
      if (total != null) setTotalCount(total);
    };

    window.addEventListener("niagara-main-failure-update", handler);

    return () =>
      window.removeEventListener("niagara-main-failure-update", handler);

  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      maxWidth={340}
      sx={{ padding: "16px 0", margin: "auto" }}
    >
      <FailureCard
        label="Total Driver Fault"
        value={failureValue}
        total={totalCount}
      />
    </Box>
  );
}