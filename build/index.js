var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  Layout: () => Layout,
  default: () => App,
  links: () => links
});
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx2("div", { className: "flex min-h-screen bg-black", children: /* @__PURE__ */ jsx2(Outlet, {}) });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index
});

// app/routes/components/bloodcontainer.tsx
import { useContext as useContext2, useState as useState2 } from "react";

// app/routes/components/blooddrop.tsx
import { MdDeleteOutline } from "react-icons/md";
import {
  useContext,
  useEffect,
  useState
} from "react";
import { FaPen } from "react-icons/fa";

// app/routes/components/input.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Input({
  label,
  data,
  setData
}) {
  return /* @__PURE__ */ jsxs2("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxs2("div", { className: "w-4", children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsx3(
      "input",
      {
        type: "number",
        value: data,
        onChange: (e) => setData(e.target.value),
        className: "bg-transparent w-full"
      }
    )
  ] });
}

// app/routes/functions/computeedge.ts
import * as THREE from "three";
function computeEdge(bloodPropertie, planeSize, x, y, prerot) {
  let rotation = prerot + 180, direction = new THREE.Vector3(
    Math.round(rotation / 180) % 2 == 0 ? 1 : -1,
    0,
    (Math.floor(rotation / 180) % 2 == 0 ? -1 : 1) * Math.abs(Math.tan(rotation * Math.PI / 180))
  ).normalize(), validDistances = [
    (planeSize - x) / direction.x,
    -x / direction.x,
    (-planeSize - y) / direction.z,
    -y / direction.z
  ].filter((d) => d > 0), maxDistance = Math.min(...validDistances), endPoint = new THREE.Vector3().copy(direction).multiplyScalar(maxDistance).add(new THREE.Vector3(x, 0, y));
  bloodPropertie.edge = new THREE.Line3(new THREE.Vector3(x, 0, y), endPoint);
}

// app/routes/functions/context.ts
import { createContext } from "react";
var defaultSettings = {
  showTrajectory: !0,
  showSP: !0,
  showAOC: !0,
  motion: "Projectile",
  material: "Paper",
  planeSize: 20
}, AppContext = createContext({
  settings: defaultSettings,
  setSettings: () => {
  },
  time: 0,
  setTime: () => {
  },
  focusBlood: 0,
  setFocusBlood: () => {
  },
  bloodProperties: [],
  setBloodProperties: () => {
  },
  bloodHeight: [],
  setBloodHeight: () => {
  }
}), CrimeSceneContext = createContext({
  trajectories: [],
  setTrajectories: () => {
  },
  center: [0, 0],
  setCenter: () => {
  },
  impact: 0,
  vicHeight: 0
});

// app/routes/components/blooddrop.tsx
import { atan, max, min, sqrt } from "mathjs";

// app/routes/functions/bloodprocessing.ts
async function bloodProcessing(image) {
  try {
    let formData = new FormData();
    formData.append("image", image);
    let response = await fetch("/api/edgedetection", {
      method: "POST",
      body: formData
    });
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);
    let data = await response.json(), contourFile = null;
    if (data.contour_image)
      try {
        let byteCharacters = atob(data.contour_image), byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset++) {
          let byteArray2 = byteCharacters.charCodeAt(offset);
          byteArrays.push(byteArray2);
        }
        let byteArray = new Uint8Array(byteArrays), blob = new Blob([byteArray], { type: "image/png" });
        contourFile = new File([blob], "contour_image.png", {
          type: "image/png"
        });
      } catch (imageError) {
        console.error("Error processing contour image:", imageError);
      }
    let ellipseEquation = null;
    return data.ellipse_equation && (ellipseEquation = data.ellipse_equation), { contourFile, ellipseEquation };
  } catch (error) {
    return console.error("Error in bloodProcessing:", error), { contourFile: null, ellipseEquation: null };
  }
}

// app/routes/components/blooddrop.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function BloodDrop({
  index,
  isDelete,
  setIsDelete,
  bloodPropertie,
  setBloodPropertie
}) {
  let { settings, bloodHeight, setBloodProperties, setFocusBlood } = useContext(AppContext), [x, setX] = useState(String(bloodPropertie.x)), [y, setY] = useState(String(bloodPropertie.y)), [rotation, setRotation] = useState(
    String(bloodPropertie.rotation || 0)
  ), [bh, setBh] = useState("0");
  useEffect(() => {
    isDelete || setBloodProperties((prevProperties) => prevProperties.map((item, i) => i === index ? (computeEdge(
      bloodPropertie,
      settings.planeSize,
      Number(x),
      -Number(y),
      Number(rotation)
    ), {
      ...item,
      x: Number(x),
      y: -Number(y),
      userrot: Number(rotation)
    }) : item));
  }, [x, y, rotation, settings]), useEffect(() => {
    let radToDeg = (radians) => radians * 180 / Math.PI, processBloodImage = async () => {
      let { contourFile, ellipseEquation } = await bloodProcessing(
        bloodPropertie.file
      ), { A, B, C, D, E, F } = ellipseEquation, semimajor = Number(
        max(
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / C),
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / A)
        )
      ), semiminor = Number(
        min(
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / C),
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / A)
        )
      ), impactAngle = radToDeg(
        atan(sqrt(semiminor ** 2 / (semimajor ** 2 - semiminor ** 2)))
      ), AOI = impactAngle;
      switch (settings.material) {
        case "Paper": {
          AOI = -2.673 + 1.068 * impactAngle;
          break;
        }
        case "Glass": {
          AOI = -9.488 + 1.213 * impactAngle;
          break;
        }
        case "Wood": {
          AOI = -2.323 + 1.065 * impactAngle;
          break;
        }
        case "Smooth Tile": {
          AOI = -5.329 + 1.109 * impactAngle;
          break;
        }
        case "Rough Tile": {
          AOI = -7.775 + 1.206 * impactAngle;
          break;
        }
      }
      let updatedPropertie = {
        ...bloodPropertie,
        processedFile: contourFile || bloodPropertie.file,
        A: A.toExponential(2),
        B: B.toExponential(2),
        C: C.toExponential(2),
        D: D.toExponential(2),
        E: E.toExponential(2),
        F: F.toExponential(2),
        semimajor: Number(semimajor.toFixed(3)),
        semiminor: Number(semiminor.toFixed(3)),
        theta: Number(impactAngle.toFixed(2)),
        AOI: Number(AOI.toFixed(2))
      };
      console.log(updatedPropertie), setBloodPropertie(updatedPropertie);
    };
    bloodPropertie.file && processBloodImage();
  }, [settings.material]), useEffect(() => {
    isDelete && (setX(String(bloodPropertie.x)), setY(String(-bloodPropertie.y)), setRotation(String(bloodPropertie.rotation || 0))), setIsDelete(!1);
  }, [isDelete]);
  function handleDelete(index2) {
    setBloodProperties((prevProperties) => {
      let updatedProperties = prevProperties.filter((_, i) => i !== index2);
      return setIsDelete(!0), updatedProperties;
    });
  }
  return useEffect(() => {
    bloodHeight.length && bloodHeight[index] != null && setBh(bloodHeight[index].toFixed(2));
  }, [bloodHeight]), /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-3 gap-2 w-full items-center", children: [
    /* @__PURE__ */ jsx4(
      "img",
      {
        src: URL.createObjectURL(bloodPropertie.file),
        className: "h-24 w-full rounded-l-md"
      }
    ),
    /* @__PURE__ */ jsxs3("div", { className: "col-span-2 flex justify-between items-start h-full", children: [
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs3("div", { className: "h-full col-span-1 flex flex-col items-start justify-start gap-2 py-2 text-left text-sm text-gray-200", children: [
          /* @__PURE__ */ jsx4(Input, { label: "x", data: x, setData: setX }),
          /* @__PURE__ */ jsx4(Input, { label: "y", data: y, setData: setY }),
          /* @__PURE__ */ jsx4(Input, { label: "r", data: rotation, setData: setRotation })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "h-full col-span-1 flex flex-col items-start justify-start gap-2 py-2 text-sm text-left text-gray-200", children: [
          /* @__PURE__ */ jsxs3("div", { children: [
            "height: ",
            Number(bh) == 0 ? "?" : bh
          ] }),
          /* @__PURE__ */ jsxs3("div", { children: [
            "AOI: ",
            bloodPropertie.AOI == 0 ? "?" : bloodPropertie.AOI
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex gap-2 p-2 items-center", children: [
        /* @__PURE__ */ jsx4("button", { onClick: () => handleDelete(index), children: /* @__PURE__ */ jsx4(MdDeleteOutline, { size: 24, color: "red" }) }),
        /* @__PURE__ */ jsx4("button", { onClick: () => setFocusBlood(index), children: /* @__PURE__ */ jsx4(FaPen, { size: 16 }) })
      ] })
    ] })
  ] });
}

// app/routes/components/bloodcontainer.tsx
import { HiOutlinePlus } from "react-icons/hi";
import * as THREE2 from "three";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function BloodContainer() {
  let { bloodProperties, setBloodProperties } = useContext2(AppContext), [isDelete, setIsDelete] = useState2(!1), defaultBlood = (uploadedFile, x = 0, y = 0, rotation = 0) => ({
    x,
    y,
    rotation,
    file: uploadedFile,
    processedFile: uploadedFile,
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    semimajor: 0,
    semiminor: 0,
    theta: 0,
    AOI: 0,
    edge: new THREE2.Line3(
      new THREE2.Vector3(x ?? 0, 0, y ?? 0),
      new THREE2.Vector3(0, 0, 0)
    ),
    height: 0
  });
  return /* @__PURE__ */ jsxs4("div", { className: "rounded-lg overflow-y-auto flex flex-col gap-2 w-full h-full p-4 border-2 border-border text-gray-200", children: [
    /* @__PURE__ */ jsxs4("div", { className: "w-full grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsxs4(
          "label",
          {
            htmlFor: "file-upload",
            className: "flex items-center gap-2 p-2 text-sm bg-gray-800 text-gray-200 rounded-md cursor-pointer hover:bg-gray-700",
            children: [
              /* @__PURE__ */ jsx5(HiOutlinePlus, { scale: 24 }),
              "Add blood"
            ]
          }
        ),
        /* @__PURE__ */ jsx5(
          "input",
          {
            id: "file-upload",
            type: "file",
            onChange: (e) => {
              let uploadedFile = e.target.files?.[0];
              uploadedFile && setBloodProperties([...bloodProperties, defaultBlood(uploadedFile)]);
            },
            className: "hidden"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: async () => {
            let sampleFilePaths = Array.from(
              { length: 10 },
              (_, i) => `/blood/blood${i + 1}.png`
            ), newFiles = await Promise.all(
              sampleFilePaths.map(async (filePath) => {
                let blob = await (await fetch(filePath)).blob(), fileName = filePath.split("/").pop() || "unknown.png";
                return new File([blob], fileName, {
                  type: blob.type
                });
              })
            ), data = await fetch("/samples.json").then((res) => res.json()), clipped = newFiles.slice(0, data.length);
            setBloodProperties([
              ...bloodProperties,
              ...clipped.map(
                (file, index) => defaultBlood(file, data[index].x, data[index].y, data[index].r)
              )
            ]);
          },
          className: "flex items-center gap-2 p-2 text-sm bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700",
          children: [
            /* @__PURE__ */ jsx5(HiOutlinePlus, { scale: 24 }),
            "Autofill"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "flex flex-col gap-2", children: bloodProperties.map((prop, index) => /* @__PURE__ */ jsx5("div", { className: "border-2 border-border rounded-lg w-full flex items-start justify-start gap-2", children: /* @__PURE__ */ jsx5(
      BloodDrop,
      {
        bloodPropertie: prop,
        index,
        isDelete,
        setIsDelete,
        setBloodPropertie: (val) => {
          setBloodProperties((prevProperties) => {
            let updatedProperties = [...prevProperties];
            return updatedProperties[index] = val, updatedProperties;
          });
        }
      }
    ) })) })
  ] });
}

// app/routes/components/bloodproperties.tsx
import { useState as useState3, useEffect as useEffect2, useRef, useContext as useContext3 } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function BloodProperties({
  bloodPropertie
}) {
  let { settings, setFocusBlood } = useContext3(AppContext), [imageUrl, setImageUrl] = useState3(null), imageRef = useRef(null);
  return useEffect2(() => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let imageUrl2 = e.target?.result;
      setImageUrl(imageUrl2);
    }, reader.readAsDataURL(bloodPropertie.processedFile);
  }, [bloodPropertie.processedFile]), /* @__PURE__ */ jsxs5("div", { className: "flex flex-col items-start justify-start w-full h-full p-4 gap-2", children: [
    /* @__PURE__ */ jsx6("button", { children: /* @__PURE__ */ jsx6(
      FaArrowLeftLong,
      {
        size: 24,
        onClick: () => setFocusBlood(-1),
        color: "white"
      }
    ) }),
    /* @__PURE__ */ jsx6("div", { className: "w-full flex items-center justify-center h-1/2", children: imageUrl && /* @__PURE__ */ jsx6("img", { ref: imageRef, src: imageUrl, className: "h-full rounded-md" }) }),
    /* @__PURE__ */ jsxs5("div", { className: "mt-4 flex flex-col gap-2 items-center w-full text-white", children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        "[ A, B, C, D, E, F ]: [",
        bloodPropertie.A,
        ", ",
        bloodPropertie.B,
        ",",
        bloodPropertie.C,
        ", ",
        bloodPropertie.D,
        ", ",
        bloodPropertie.E,
        ",",
        bloodPropertie.F,
        "]"
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        "Semi-minor: ",
        bloodPropertie.semiminor,
        ", Semi-major:",
        " ",
        bloodPropertie.semimajor
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        "AOI (",
        settings.material,
        "): ",
        bloodPropertie.AOI,
        "\xB0"
      ] })
    ] })
  ] });
}

// app/routes/functions/computetrajectory.ts
import * as THREE3 from "three";
function computeTrajectory(prop, center, motion) {
  let positions = [], { x, y, AOI } = prop, di = Math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2);
  if (di == 0 || AOI == 0)
    return [];
  let tan = Math.tan(AOI * Math.PI / 180);
  for (let i = 0; i <= 100; i++) {
    let t = i / 100, cx = center[0] + (x - center[0]) * t, cz = center[1] + (y - center[1]) * t, xt = di * t, h = motion == "Straight" ? di * tan : di ** 2 * tan / (3 * di - 1), cy = motion == "Free fall" ? -1 / (2 * di) * tan * xt * xt + h : motion == "Straight" ? -(h / di) * xt + h : (h - di * tan) / (di * di) * xt * xt + (tan - 2 * h / di) * xt + h;
    positions.push(new THREE3.Vector3(cx, cy, cz));
  }
  return positions;
}

// app/routes/components/crimescene.tsx
import { useContext as useContext10, useEffect as useEffect7, useState as useState5 } from "react";

// app/routes/components/bloodprojectile.tsx
import { useContext as useContext4, useEffect as useEffect3, useRef as useRef2 } from "react";
import * as THREE4 from "three";
import { Fragment, jsx as jsx7 } from "react/jsx-runtime";
function BloodProjectile() {
  let { trajectories } = useContext4(CrimeSceneContext), { time } = useContext4(AppContext), lineRefs = useRef2([]);
  return useEffect3(() => {
    trajectories.forEach((points, index) => {
      if (lineRefs.current[index]) {
        let trajIndex = Math.min(Math.floor(time), points.length - 1), visiblePoints = points.slice(0, trajIndex + 1), geometry = new THREE4.BufferGeometry().setFromPoints(
          visiblePoints
        );
        lineRefs.current[index].geometry = geometry;
      }
    });
  }, [time, trajectories]), /* @__PURE__ */ jsx7(Fragment, { children: trajectories.map((_, index) => /* @__PURE__ */ jsx7("line", { ref: (el) => lineRefs.current[index] = el, children: /* @__PURE__ */ jsx7("lineBasicMaterial", { color: "#d68dd2", linewidth: 0.5 }) }, index)) });
}

// app/routes/components/crimescene.tsx
import { Canvas } from "@react-three/fiber";

// app/routes/components/bloodstraight.tsx
import { useContext as useContext5, useEffect as useEffect4, useRef as useRef3 } from "react";
import * as THREE5 from "three";
import { Fragment as Fragment2, jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function BloodStraight() {
  let { bloodProperties, settings } = useContext5(AppContext), lineRefs = useRef3([]), directionRefs = useRef3([]), rotatedDirectionRefs = useRef3([]);
  return useEffect4(() => {
    bloodProperties.forEach((prop, index) => {
      let edge = prop.edge, angle = prop.AOI;
      directionRefs.current[index] = new THREE5.Vector3().subVectors(edge.end, edge.start).normalize();
      let rotationAxis = directionRefs.current[index].clone().cross(new THREE5.Vector3(0, 1, 0)).normalize();
      rotatedDirectionRefs.current[index] = new THREE5.Vector3().copy(directionRefs.current[index]).applyAxisAngle(rotationAxis, angle * Math.PI / 180);
    });
  }, [bloodProperties, settings]), /* @__PURE__ */ jsx8(Fragment2, { children: bloodProperties.map((prop, index) => {
    let edge = prop.edge, lineThickness = 1e-3 * settings.planeSize, geometry = new THREE5.TubeGeometry(
      new THREE5.LineCurve3(edge.start, edge.end),
      20,
      lineThickness,
      8,
      !1
    ), arrowSize = lineThickness * 8;
    return /* @__PURE__ */ jsxs6("group", { children: [
      /* @__PURE__ */ jsx8(
        "mesh",
        {
          ref: (el) => lineRefs.current[index] = el,
          geometry,
          children: /* @__PURE__ */ jsx8("meshBasicMaterial", { color: "red" })
        }
      ),
      /* @__PURE__ */ jsx8(
        "arrowHelper",
        {
          args: [
            directionRefs.current[index],
            edge.end,
            0.05,
            "red",
            arrowSize,
            arrowSize
          ]
        }
      )
    ] }, index);
  }) });
}

// app/routes/components/bloodpoint.tsx
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext as useContext6, useEffect as useEffect5, useRef as useRef4 } from "react";
import { Fragment as Fragment3, jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
function BloodPoint() {
  let { bloodProperties, settings } = useContext6(AppContext), dotRefs = useRef4([]), textRefs = useRef4([]);
  return useEffect5(() => {
    bloodProperties.forEach((prop, index) => {
      dotRefs.current[index] && dotRefs.current[index].position.copy(prop.edge.start);
    });
  }, [bloodProperties, settings.planeSize]), useFrame(({ camera }) => {
    bloodProperties.forEach((_, index) => {
      textRefs.current[index] && textRefs.current[index].lookAt(camera.position);
    });
  }), /* @__PURE__ */ jsx9(Fragment3, { children: bloodProperties.map((prop, index) => /* @__PURE__ */ jsxs7("group", { children: [
    /* @__PURE__ */ jsxs7("mesh", { ref: (el) => dotRefs.current[index] = el, children: [
      /* @__PURE__ */ jsx9("sphereGeometry", { args: [4e-3 * settings.planeSize, 12, 12] }),
      /* @__PURE__ */ jsx9("meshBasicMaterial", { color: "red" })
    ] }),
    /* @__PURE__ */ jsx9(
      Text,
      {
        ref: (el) => textRefs.current[index] = el,
        position: [
          prop.edge.start.x,
          prop.edge.start.y - 0.015 * settings.planeSize,
          prop.edge.start.z
        ],
        fontSize: 0.01 * settings.planeSize,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: index + 1
      }
    )
  ] }, index)) });
}

// app/routes/components/aoc.tsx
import { useRef as useRef5, useEffect as useEffect6, useState as useState4, useContext as useContext7 } from "react";
import { Text as Text2 } from "@react-three/drei";
import { useFrame as useFrame2 } from "@react-three/fiber";
import * as THREE6 from "three";
import { Fragment as Fragment4, jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function AOC() {
  let { bloodProperties, settings } = useContext7(AppContext), { center, setCenter, impact, vicHeight } = useContext7(CrimeSceneContext), textRef = useRef5(null), centerRef = useRef5(null), ringRef = useRef5(null), [r, setR] = useState4(0), [innerRadius, setInnerRadius] = useState4(0), checkCollisions = ({
    circleSphere
  }) => {
    let flag = !0;
    return bloodProperties.forEach((prop) => {
      let closestPoint = new THREE6.Vector3();
      if (prop.edge.closestPointToPoint(circleSphere.center, !0, closestPoint), closestPoint.distanceTo(circleSphere.center) > circleSphere.radius) {
        flag = !1;
        return;
      }
    }), flag;
  };
  return useEffect6(() => {
    let planeSize = settings.planeSize, lr = -planeSize / 2, rr = -lr, resX = 0, resY = 0, resR = 0;
    if (bloodProperties.length != 0)
      for (; lr < rr; ) {
        let x = -planeSize / 2, mr = (lr + rr) / 2, flag = !1;
        for (; x < planeSize / 2; ) {
          let y = -planeSize / 2;
          for (; y < planeSize / 2; ) {
            let circleSphere = new THREE6.Sphere(
              new THREE6.Vector3(x, 0, y),
              mr
            );
            checkCollisions({ circleSphere }) && (flag = !0, resX = x, resY = y, resR = mr), y += planeSize / 20;
          }
          x += planeSize / 20;
        }
        flag ? rr = mr : lr = mr + planeSize / 40;
      }
    setCenter([resX, resY]);
    let safeR = Math.max(r, 1);
    setInnerRadius(Math.max(1 - 1 / (2.5 * safeR), 0.01)), setR(lr), ringRef.current && (ringRef.current.position.set(resX, 0, resY), ringRef.current.scale.set(resR, resR, 1), ringRef.current.rotation.x = Math.PI / 2);
  }, [bloodProperties, settings]), useFrame2(({ camera }) => {
    textRef.current && textRef.current.lookAt(camera.position), centerRef.current && centerRef.current.lookAt(camera.position);
  }), /* @__PURE__ */ jsxs8(Fragment4, { children: [
    /* @__PURE__ */ jsxs8("mesh", { ref: ringRef, children: [
      /* @__PURE__ */ jsx10("ringGeometry", { args: [innerRadius, 1, 64] }),
      /* @__PURE__ */ jsx10(
        "meshBasicMaterial",
        {
          color: "white",
          opacity: 0.9,
          transparent: !0,
          side: THREE6.DoubleSide
        }
      )
    ] }),
    bloodProperties.length != 0 && r >= 0.25 && /* @__PURE__ */ jsxs8(Fragment4, { children: [
      /* @__PURE__ */ jsxs8(
        Text2,
        {
          ref: textRef,
          position: [center[0], vicHeight + 10, center[1]],
          fontSize: 0.015 * settings.planeSize,
          color: "white",
          anchorX: "center",
          anchorY: "middle",
          children: [
            "Point of Impact = (",
            center[0],
            ", ",
            -center[1],
            ", ",
            impact.toFixed(2),
            ")"
          ]
        }
      ),
      /* @__PURE__ */ jsxs8(
        Text2,
        {
          ref: centerRef,
          position: [center[0], vicHeight + 5, center[1]],
          fontSize: 0.015 * settings.planeSize,
          color: "white",
          anchorX: "center",
          anchorY: "middle",
          children: [
            "(h,k) = (",
            center[0],
            ", ",
            -center[1],
            "), r = ",
            r.toFixed(2)
          ]
        }
      )
    ] })
  ] });
}

// app/routes/components/axis.tsx
import * as THREE7 from "three";
import { Text as Text3 } from "@react-three/drei";
import { useContext as useContext8 } from "react";
import { Fragment as Fragment5, jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
function Axis() {
  let { settings } = useContext8(AppContext), createAxisLine = (start, end, color) => {
    let material = new THREE7.LineBasicMaterial({ color }), geometry = new THREE7.BufferGeometry().setFromPoints([start, end]);
    return new THREE7.Line(geometry, material);
  };
  return /* @__PURE__ */ jsxs9(Fragment5, { children: [
    /* @__PURE__ */ jsx11(
      "primitive",
      {
        object: createAxisLine(
          new THREE7.Vector3(0, 0, 0),
          new THREE7.Vector3(0, settings.planeSize, 0),
          "red"
        )
      }
    ),
    /* @__PURE__ */ jsx11(
      "primitive",
      {
        object: createAxisLine(
          new THREE7.Vector3(0, 0, 0),
          new THREE7.Vector3(0, 0, -settings.planeSize),
          "green"
        )
      }
    ),
    /* @__PURE__ */ jsx11(
      "primitive",
      {
        object: createAxisLine(
          new THREE7.Vector3(0, 0, 0),
          new THREE7.Vector3(settings.planeSize, 0, 0),
          "blue"
        )
      }
    ),
    /* @__PURE__ */ jsx11(
      Text3,
      {
        position: [settings.planeSize * 1.02, 0, 0],
        fontSize: settings.planeSize / 25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "X"
      }
    ),
    /* @__PURE__ */ jsx11(
      Text3,
      {
        position: [0, 0, -settings.planeSize * 1.02],
        fontSize: settings.planeSize / 25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "Y"
      }
    ),
    /* @__PURE__ */ jsx11(
      Text3,
      {
        position: [0, settings.planeSize * 1.02, 0],
        fontSize: settings.planeSize / 25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "Z"
      }
    ),
    /* @__PURE__ */ jsx11(
      Text3,
      {
        position: [0, -0.3, 0],
        fontSize: 0.25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "(0, 0)"
      }
    )
  ] });
}

// app/routes/components/scene.tsx
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useContext as useContext9 } from "react";
import { Fragment as Fragment6, jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function Scene() {
  let { settings } = useContext9(AppContext);
  return /* @__PURE__ */ jsxs10(Fragment6, { children: [
    /* @__PURE__ */ jsx12(
      PerspectiveCamera,
      {
        makeDefault: !0,
        position: [
          settings.planeSize + settings.planeSize / 4,
          settings.planeSize / 2,
          -settings.planeSize - settings.planeSize / 4
        ],
        fov: 25
      }
    ),
    /* @__PURE__ */ jsx12(
      OrbitControls,
      {
        target: [settings.planeSize / 2, 0, -settings.planeSize / 2]
      }
    ),
    /* @__PURE__ */ jsx12("ambientLight", { intensity: 0.5 }),
    /* @__PURE__ */ jsx12("directionalLight", { position: [3, 3, -3] }),
    /* @__PURE__ */ jsx12(
      "gridHelper",
      {
        args: [settings.planeSize, 10],
        position: [settings.planeSize / 2, 0, -settings.planeSize / 2]
      }
    ),
    /* @__PURE__ */ jsx12(
      "gridHelper",
      {
        args: [settings.planeSize, 10],
        rotation: [Math.PI / 2, 0, 0],
        position: [settings.planeSize / 2, settings.planeSize / 2, 0]
      }
    ),
    /* @__PURE__ */ jsx12(
      "gridHelper",
      {
        args: [settings.planeSize, 10],
        rotation: [0, 0, Math.PI / 2],
        position: [0, settings.planeSize / 2, -settings.planeSize / 2]
      }
    )
  ] });
}

// app/routes/components/crimescene.tsx
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
function Crimescene() {
  let { bloodProperties, settings, setBloodHeight } = useContext10(AppContext), [trajectories, setTrajectories] = useState5([]), [center, setCenter] = useState5([0, 0]), [vicHeight, setVicHeight] = useState5(0), [impact, setImpact] = useState5(0);
  return useEffect7(() => {
    let sumh = 0, maxh = 0, tempBloodHeight = [];
    bloodProperties.map((prop) => {
      let { x, y, AOI } = prop, di = Math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2), tan = Math.tan(AOI * Math.PI / 180), temp = settings.motion == "Straight" ? di * tan : di ** 2 * tan / (3 * di - 1);
      sumh += temp, maxh = Math.max(maxh, temp), tempBloodHeight.push(temp);
    }), setVicHeight(maxh), setImpact(sumh / bloodProperties.length), setBloodHeight(tempBloodHeight), setTrajectories(
      bloodProperties.map(
        (prop) => computeTrajectory(prop, center, settings.motion)
      )
    );
  }, [bloodProperties, center, settings, vicHeight]), /* @__PURE__ */ jsx13(
    CrimeSceneContext.Provider,
    {
      value: {
        trajectories,
        setTrajectories,
        center,
        setCenter,
        vicHeight,
        impact
      },
      children: /* @__PURE__ */ jsxs11(Canvas, { children: [
        /* @__PURE__ */ jsx13(Scene, {}),
        /* @__PURE__ */ jsx13(Axis, {}),
        /* @__PURE__ */ jsx13(BloodPoint, {}),
        settings.showTrajectory && /* @__PURE__ */ jsx13(BloodProjectile, {}),
        settings.showSP && /* @__PURE__ */ jsx13(BloodStraight, {}),
        settings.showAOC && /* @__PURE__ */ jsx13(AOC, {}),
        bloodProperties.length != 0 && /* @__PURE__ */ jsxs11("mesh", { position: [center[0], vicHeight / 2, center[1]], children: [
          /* @__PURE__ */ jsx13(
            "cylinderGeometry",
            {
              args: [
                settings.planeSize / 100,
                settings.planeSize / 100,
                vicHeight,
                16
              ]
            }
          ),
          /* @__PURE__ */ jsx13("meshBasicMaterial", { color: "white", opacity: 1, transparent: !0 })
        ] }),
        trajectories.map(
          (points, index) => points.length > 0 ? /* @__PURE__ */ jsxs11(
            "mesh",
            {
              position: [center[0], points[0].y, center[1]],
              rotation: [Math.PI / 2, 0, 0],
              children: [
                /* @__PURE__ */ jsx13("torusGeometry", { args: [settings.planeSize / 100, 0.025, 16, 32] }),
                /* @__PURE__ */ jsx13("meshBasicMaterial", { color: "red" })
              ]
            },
            index
          ) : null
        ),
        impact && /* @__PURE__ */ jsxs11(
          "mesh",
          {
            position: [center[0], impact, center[1]],
            rotation: [Math.PI / 2, 0, 0],
            children: [
              /* @__PURE__ */ jsx13("torusGeometry", { args: [settings.planeSize / 100, 0.025, 16, 32] }),
              /* @__PURE__ */ jsx13("meshBasicMaterial", { color: "green" })
            ]
          }
        )
      ] })
    }
  );
}

// app/routes/components/timeslider.tsx
import { useContext as useContext11, useEffect as useEffect8, useRef as useRef6, useState as useState6 } from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";
import { Fragment as Fragment7, jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
function TimeSlider() {
  let { time, setTime } = useContext11(AppContext), animationRef = useRef6(), lastUpdateTime = useRef6(0), isAnimating = useRef6(!1), [isPlaying, setIsPlaying] = useState6(!0);
  useEffect8(() => {
    let animate = (currentTime) => {
      if (isAnimating.current) {
        if (currentTime - lastUpdateTime.current >= 100) {
          let nextTime = time + 1;
          setTime(nextTime >= 100 ? 100 : nextTime), lastUpdateTime.current = currentTime;
        }
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    return isPlaying && (isAnimating.current = !0, animationRef.current = requestAnimationFrame(animate)), () => {
      cancelAnimationFrame(animationRef.current), isAnimating.current = !1;
    };
  }, [isPlaying, time, setTime]);
  let handleClick = (e) => {
    let rect = e.currentTarget.getBoundingClientRect(), clickX = e.clientX - rect.left, sliderWidth = rect.width, newTime = clickX / sliderWidth * 100;
    setTime(newTime);
  }, handlePlayStop = () => {
    setIsPlaying((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs12(Fragment7, { children: [
    /* @__PURE__ */ jsxs12("div", { className: "relative w-full h-6 cursor-pointer", onClick: handleClick, children: [
      /* @__PURE__ */ jsx14("div", { className: "absolute top-1/2 left-0 w-full h-1 bg-gray-500 rounded-full -translate-y-1/2" }),
      /* @__PURE__ */ jsx14(
        "div",
        {
          className: "absolute top-1/2 left-0 h-1 bg-gray-200 rounded-full -translate-y-1/2 transition-all",
          style: { width: `${time}%` }
        }
      ),
      /* @__PURE__ */ jsx14(
        "div",
        {
          className: "absolute top-1/2 h-4 w-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 transition-all",
          style: { left: `${time}%` }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs12("div", { className: "w-full flex items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx14("button", { onClick: () => setTime(0), children: /* @__PURE__ */ jsx14(FaBackward, { size: 24, color: "white" }) }),
      /* @__PURE__ */ jsx14("button", { onClick: handlePlayStop, children: isPlaying ? /* @__PURE__ */ jsx14(FaPause, { size: 24, color: "white" }) : /* @__PURE__ */ jsx14(FaPlay, { size: 24, color: "white" }) }),
      /* @__PURE__ */ jsx14("button", { onClick: () => setTime(100), children: /* @__PURE__ */ jsx14(FaForward, { size: 24, color: "white" }) })
    ] })
  ] });
}

// app/routes/components/settings.tsx
import { useContext as useContext12, useEffect as useEffect9, useState as useState7 } from "react";

// app/routes/components/selector.tsx
import { jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
function Selector({
  title,
  choices,
  selectedChoice,
  setSelectedChoice
}) {
  return /* @__PURE__ */ jsxs13("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsx15("div", { className: "text-gray-200 font-bold", children: title }),
    /* @__PURE__ */ jsx15("div", { className: "mt-2", children: /* @__PURE__ */ jsx15(
      "select",
      {
        value: selectedChoice || "",
        onChange: (e) => setSelectedChoice(e.target.value),
        className: "w-32 p-2 border rounded-md bg-black text-white",
        children: choices.map((choice) => /* @__PURE__ */ jsx15("option", { value: choice, children: choice }, choice))
      }
    ) })
  ] });
}

// app/routes/components/tickbox.tsx
import { FaCheck } from "react-icons/fa";
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
function Tickbox({
  title,
  data,
  setData
}) {
  return /* @__PURE__ */ jsx16("div", { className: "relative", children: /* @__PURE__ */ jsxs14("label", { className: "flex gap-2 items-center text-white", children: [
    /* @__PURE__ */ jsx16(
      "input",
      {
        type: "checkbox",
        checked: data,
        onChange: (event) => {
          setData(event.target.checked);
        },
        className: "peer hidden"
      }
    ),
    /* @__PURE__ */ jsx16("div", { className: "w-5 h-5 border-2 border-white rounded-md flex justify-center items-center relative peer-checked:bg-white checked:fill-black" }),
    /* @__PURE__ */ jsx16(
      FaCheck,
      {
        className: "text-white absolute left-1",
        size: 12,
        color: "black"
      }
    ),
    title
  ] }) });
}

// app/routes/components/settings.tsx
import { jsx as jsx17, jsxs as jsxs15 } from "react/jsx-runtime";
function Settings() {
  let { settings, setSettings, bloodProperties } = useContext12(AppContext), [showTrajectory, setShowTrajectory] = useState7(settings.showTrajectory), [showSP, setShowSP] = useState7(settings.showSP), [showAOC, setShowAOC] = useState7(settings.showAOC), [motion, setMotion] = useState7(settings.motion), [material, setMaterial] = useState7(settings.material), [planeSize, setPlaneSize] = useState7("20");
  return useEffect9(() => {
    setSettings({
      showTrajectory,
      showSP,
      showAOC,
      motion,
      material,
      planeSize: Number(planeSize)
    });
  }, [showTrajectory, showSP, showAOC, motion, material, planeSize]), useEffect9(() => {
    let maxSize = 20;
    bloodProperties.forEach((prop) => {
      maxSize = Math.max(maxSize, prop.x, -prop.y);
    }), setPlaneSize(String(Math.ceil(maxSize / 10) * 10));
  }, [bloodProperties]), /* @__PURE__ */ jsxs15("div", { className: "w-full flex rounded-lg justify-between items-center border-2 border-border p-4", children: [
    /* @__PURE__ */ jsx17(
      Selector,
      {
        title: "Blood Motion",
        choices: ["Projectile", "Free fall", "Straight"],
        selectedChoice: motion,
        setSelectedChoice: setMotion
      }
    ),
    /* @__PURE__ */ jsx17(
      Tickbox,
      {
        title: "Show Blood Motion",
        data: showTrajectory,
        setData: setShowTrajectory
      }
    ),
    /* @__PURE__ */ jsx17(Tickbox, { title: "Show Blood Path", data: showSP, setData: setShowSP }),
    /* @__PURE__ */ jsx17(Tickbox, { title: "Show AOC", data: showAOC, setData: setShowAOC }),
    /* @__PURE__ */ jsx17(
      Selector,
      {
        title: "AOI Material",
        choices: ["Paper", "Glass", "Wood", "Smooth Tile", "Rough Tile"],
        selectedChoice: material,
        setSelectedChoice: setMaterial
      }
    )
  ] });
}

// app/routes/_index.tsx
import { useState as useState8 } from "react";
import { jsx as jsx18, jsxs as jsxs16 } from "react/jsx-runtime";
function Index() {
  let [settings, setSettings] = useState8({
    showTrajectory: !0,
    showSP: !0,
    showAOC: !0,
    motion: "Projectile",
    material: "Paper",
    planeSize: 20
  }), [time, setTime] = useState8(0), [focusBlood, setFocusBlood] = useState8(-1), [bloodHeight, setBloodHeight] = useState8([]), [bloodProperties, setBloodProperties] = useState8(
    []
  );
  return /* @__PURE__ */ jsx18(
    AppContext.Provider,
    {
      value: {
        settings,
        setSettings,
        time,
        setTime,
        focusBlood,
        setFocusBlood,
        bloodProperties,
        setBloodProperties,
        bloodHeight,
        setBloodHeight
      },
      children: /* @__PURE__ */ jsx18("div", { className: "w-full max-h-screen h-screen flex flex-col items-center justify-center p-6", children: /* @__PURE__ */ jsxs16("div", { className: "w-full h-full gap-4 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx18(Settings, {}),
        /* @__PURE__ */ jsxs16("div", { className: "w-full h-[64vh] grid grid-cols-10 gap-6", children: [
          /* @__PURE__ */ jsx18("div", { className: "col-span-3 h-full overflow-y-auto", children: /* @__PURE__ */ jsx18(BloodContainer, {}) }),
          /* @__PURE__ */ jsx18("div", { className: "col-span-7 border-2 border-border rounded-lg", children: focusBlood != -1 ? /* @__PURE__ */ jsx18(BloodProperties, { bloodPropertie: bloodProperties[focusBlood] }) : /* @__PURE__ */ jsx18(Crimescene, {}) })
        ] }),
        focusBlood == -1 && /* @__PURE__ */ jsx18(TimeSlider, {})
      ] }) })
    }
  );
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-DBHE6WGP.js", imports: ["/build/_shared/chunk-D3NFQ7GU.js", "/build/_shared/chunk-BVJBT3X3.js", "/build/_shared/chunk-T36URGAI.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-GRUYUMNE.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-H6UXXTYN.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "34c794a7", hmr: void 0, url: "/build/manifest-34C794A7.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
