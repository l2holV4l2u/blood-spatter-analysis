import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen, FaBackward, FaPause, FaPlay, FaForward, FaCheck } from "react-icons/fa";
import * as THREE from "three";
import { max, sqrt, min, atan } from "mathjs";
import { HiOutlinePlus } from "react-icons/hi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useFrame, Canvas } from "@react-three/fiber";
import { Text, PerspectiveCamera, OrbitControls } from "@react-three/drei";
const ABORT_DELAY = 5e3;
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
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
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
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
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
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
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
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen bg-black", children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Input({
  label,
  data,
  setData
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-4", children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsx(
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
function computeEdge(bloodPropertie, planeSize, x, y, prerot) {
  const rotation = prerot + 180;
  const direction = new THREE.Vector3(
    Math.round(rotation / 180) % 2 == 0 ? 1 : -1,
    0,
    (Math.floor(rotation / 180) % 2 == 0 ? -1 : 1) * Math.abs(Math.tan(rotation * Math.PI / 180))
  ).normalize();
  const maxDistances = [
    (planeSize - x) / direction.x,
    -x / direction.x,
    (-planeSize - y) / direction.z,
    -y / direction.z
  ];
  const validDistances = maxDistances.filter((d) => d > 0);
  const maxDistance = Math.min(...validDistances);
  const endPoint = new THREE.Vector3().copy(direction).multiplyScalar(maxDistance).add(new THREE.Vector3(x, 0, y));
  bloodPropertie.edge = new THREE.Line3(new THREE.Vector3(x, 0, y), endPoint);
}
const defaultSettings = {
  showTrajectory: true,
  showSP: true,
  showAOC: true,
  motion: "Projectile",
  material: "Paper",
  planeSize: 20
};
const AppContext = createContext({
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
});
const CrimeSceneContext = createContext({
  trajectories: [],
  setTrajectories: () => {
  },
  center: [0, 0],
  setCenter: () => {
  },
  impact: 0,
  vicHeight: 0
});
async function bloodProcessing(image) {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch("http://127.0.0.1:5000/api/edgedetection/", {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  let contourFile = null;
  if (data.contour_image) {
    const byteCharacters = atob(data.contour_image);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      const byteArray2 = byteCharacters.charCodeAt(offset);
      byteArrays.push(byteArray2);
    }
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: "image/png" });
    contourFile = new File([blob], "contour_image.png", { type: "image/png" });
  }
  let ellipseEquation = null;
  if (data.ellipse_equation) {
    ellipseEquation = data.ellipse_equation;
  }
  return { contourFile, ellipseEquation };
}
function BloodDrop({
  index,
  isDelete,
  setIsDelete,
  bloodPropertie,
  setBloodPropertie
}) {
  const { settings, bloodHeight, setBloodProperties, setFocusBlood } = useContext(AppContext);
  const [x, setX] = useState(String(bloodPropertie.x));
  const [y, setY] = useState(String(bloodPropertie.y));
  const [rotation, setRotation] = useState(
    String(bloodPropertie.rotation || 0)
  );
  const [bh, setBh] = useState("0");
  useEffect(() => {
    if (!isDelete) {
      setBloodProperties((prevProperties) => {
        const updatedProperties = prevProperties.map((item, i) => {
          if (i === index) {
            computeEdge(
              bloodPropertie,
              settings.planeSize,
              Number(x),
              -Number(y),
              Number(rotation)
            );
            return {
              ...item,
              x: Number(x),
              y: -Number(y),
              userrot: Number(rotation)
            };
          }
          return item;
        });
        return updatedProperties;
      });
    }
  }, [x, y, rotation, settings]);
  useEffect(() => {
    const radToDeg = (radians) => radians * 180 / Math.PI;
    const processBloodImage = async () => {
      const { contourFile, ellipseEquation } = await bloodProcessing(
        bloodPropertie.file
      );
      const { A, B, C, D, E, F } = ellipseEquation;
      const semimajor = Number(
        max(
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / C),
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / A)
        )
      );
      const semiminor = Number(
        min(
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / C),
          sqrt((-F + D ** 2 / (4 * A) + E ** 2 / (4 * C)) / A)
        )
      );
      const impactAngle = radToDeg(
        atan(sqrt(semiminor ** 2 / (semimajor ** 2 - semiminor ** 2)))
      );
      let AOI = impactAngle;
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
      const updatedPropertie = {
        ...bloodPropertie,
        processedFile: contourFile ? contourFile : bloodPropertie.file,
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
      console.log(updatedPropertie);
      setBloodPropertie(updatedPropertie);
    };
    if (bloodPropertie.file) {
      processBloodImage();
    }
  }, [settings.material]);
  useEffect(() => {
    if (isDelete) {
      setX(String(bloodPropertie.x));
      setY(String(-bloodPropertie.y));
      setRotation(String(bloodPropertie.rotation || 0));
    }
    setIsDelete(false);
  }, [isDelete]);
  function handleDelete(index2) {
    setBloodProperties((prevProperties) => {
      const updatedProperties = prevProperties.filter((_, i) => i !== index2);
      setIsDelete(true);
      return updatedProperties;
    });
  }
  useEffect(() => {
    if (bloodHeight.length) {
      if (bloodHeight[index] != void 0) {
        setBh(bloodHeight[index].toFixed(2));
      }
    }
  }, [bloodHeight]);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 w-full items-center", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: URL.createObjectURL(bloodPropertie.file),
        className: "h-24 w-full rounded-l-md"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex justify-between items-start h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "h-full col-span-1 flex flex-col items-start justify-start gap-2 py-2 text-left text-sm text-gray-200", children: [
          /* @__PURE__ */ jsx(Input, { label: "x", data: x, setData: setX }),
          /* @__PURE__ */ jsx(Input, { label: "y", data: y, setData: setY }),
          /* @__PURE__ */ jsx(Input, { label: "r", data: rotation, setData: setRotation })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "h-full col-span-1 flex flex-col items-start justify-start gap-2 py-2 text-sm text-left text-gray-200", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "height: ",
            Number(bh) == 0 ? "?" : bh
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "AOI: ",
            bloodPropertie.AOI == 0 ? "?" : bloodPropertie.AOI
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-2 items-center", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(index), children: /* @__PURE__ */ jsx(MdDeleteOutline, { size: 24, color: "red" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setFocusBlood(index), children: /* @__PURE__ */ jsx(FaPen, { size: 16 }) })
      ] })
    ] })
  ] });
}
function BloodContainer() {
  const { bloodProperties, setBloodProperties } = useContext(AppContext);
  const [isDelete, setIsDelete] = useState(false);
  const defaultBlood = (uploadedFile, x = 0, y = 0, rotation = 0) => ({
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
    edge: new THREE.Line3(
      new THREE.Vector3(x ?? 0, 0, y ?? 0),
      new THREE.Vector3(0, 0, 0)
    ),
    height: 0
  });
  const handleFileChange = (e) => {
    var _a;
    const uploadedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (uploadedFile) {
      setBloodProperties([...bloodProperties, defaultBlood(uploadedFile)]);
    }
  };
  const handleAutofill = async () => {
    const sampleFilePaths = Array.from(
      { length: 10 },
      (_, i) => `/blood/blood${i + 1}.png`
    );
    const newFiles = await Promise.all(
      sampleFilePaths.map(async (filePath) => {
        const response = await fetch(filePath);
        const blob = await response.blob();
        const fileName = filePath.split("/").pop() || "unknown.png";
        return new File([blob], fileName, {
          type: blob.type
        });
      })
    );
    const data = await fetch("/samples.json").then((res) => res.json());
    const clipped = newFiles.slice(0, data.length);
    setBloodProperties([
      ...bloodProperties,
      ...clipped.map(
        (file, index) => defaultBlood(file, data[index].x, data[index].y, data[index].r)
      )
    ]);
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg overflow-y-auto flex flex-col gap-2 w-full h-full p-4 border-2 border-border text-gray-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: "file-upload",
            className: "flex items-center gap-2 p-2 text-sm bg-gray-800 text-gray-200 rounded-md cursor-pointer hover:bg-gray-700",
            children: [
              /* @__PURE__ */ jsx(HiOutlinePlus, { scale: 24 }),
              "Add blood"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "file-upload",
            type: "file",
            onChange: handleFileChange,
            className: "hidden"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAutofill,
          className: "flex items-center gap-2 p-2 text-sm bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700",
          children: [
            /* @__PURE__ */ jsx(HiOutlinePlus, { scale: 24 }),
            "Autofill"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: bloodProperties.map((prop, index) => /* @__PURE__ */ jsx("div", { className: "border-2 border-border rounded-lg w-full flex items-start justify-start gap-2", children: /* @__PURE__ */ jsx(
      BloodDrop,
      {
        bloodPropertie: prop,
        index,
        isDelete,
        setIsDelete,
        setBloodPropertie: (val) => {
          setBloodProperties((prevProperties) => {
            const updatedProperties = [...prevProperties];
            updatedProperties[index] = val;
            return updatedProperties;
          });
        }
      }
    ) })) })
  ] });
}
function BloodProperties({
  bloodPropertie
}) {
  const { settings, setFocusBlood } = useContext(AppContext);
  const [imageUrl, setImageUrl] = useState(null);
  const imageRef = useRef(null);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      const imageUrl2 = (_a = e.target) == null ? void 0 : _a.result;
      setImageUrl(imageUrl2);
    };
    reader.readAsDataURL(bloodPropertie.processedFile);
  }, [bloodPropertie.processedFile]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-start w-full h-full p-4 gap-2", children: [
    /* @__PURE__ */ jsx("button", { children: /* @__PURE__ */ jsx(
      FaArrowLeftLong,
      {
        size: 24,
        onClick: () => setFocusBlood(-1),
        color: "white"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "w-full flex items-center justify-center h-1/2", children: imageUrl && /* @__PURE__ */ jsx("img", { ref: imageRef, src: imageUrl, className: "h-full rounded-md" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-2 items-center w-full text-white", children: [
      /* @__PURE__ */ jsxs("div", { children: [
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
      /* @__PURE__ */ jsxs("div", { children: [
        "Semi-minor: ",
        bloodPropertie.semiminor,
        ", Semi-major:",
        " ",
        bloodPropertie.semimajor
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        "AOI (",
        settings.material,
        "): ",
        bloodPropertie.AOI,
        "°"
      ] })
    ] })
  ] });
}
function computeTrajectory(prop, center, motion) {
  const positions = [];
  let { x, y, AOI } = prop;
  const di = Math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2);
  if (di == 0 || AOI == 0) {
    return [];
  }
  const tan = Math.tan(AOI * Math.PI / 180);
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const cx = center[0] + (x - center[0]) * t;
    const cz = center[1] + (y - center[1]) * t;
    const xt = di * t;
    const h = motion == "Straight" ? di * tan : di ** 2 * tan / (3 * di - 1);
    const cy = motion == "Free fall" ? -1 / (2 * di) * tan * xt * xt + h : motion == "Straight" ? -(h / di) * xt + h : (h - di * tan) / (di * di) * xt * xt + (tan - 2 * h / di) * xt + h;
    positions.push(new THREE.Vector3(cx, cy, cz));
  }
  return positions;
}
function BloodProjectile() {
  const { trajectories } = useContext(CrimeSceneContext);
  const { time } = useContext(AppContext);
  const lineRefs = useRef([]);
  useEffect(() => {
    trajectories.forEach((points, index) => {
      if (lineRefs.current[index]) {
        const trajIndex = Math.min(Math.floor(time), points.length - 1);
        const visiblePoints = points.slice(0, trajIndex + 1);
        const geometry = new THREE.BufferGeometry().setFromPoints(
          visiblePoints
        );
        lineRefs.current[index].geometry = geometry;
      }
    });
  }, [time, trajectories]);
  return /* @__PURE__ */ jsx(Fragment, { children: trajectories.map((_, index) => /* @__PURE__ */ jsx("line", { ref: (el) => lineRefs.current[index] = el, children: /* @__PURE__ */ jsx("lineBasicMaterial", { color: "#d68dd2", linewidth: 0.5 }) }, index)) });
}
function BloodStraight() {
  const { bloodProperties, settings } = useContext(AppContext);
  const lineRefs = useRef([]);
  const directionRefs = useRef([]);
  const rotatedDirectionRefs = useRef([]);
  useEffect(() => {
    bloodProperties.forEach((prop, index) => {
      const edge = prop.edge;
      const angle = prop.AOI;
      directionRefs.current[index] = new THREE.Vector3().subVectors(edge.end, edge.start).normalize();
      const rotationAxis = directionRefs.current[index].clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
      rotatedDirectionRefs.current[index] = new THREE.Vector3().copy(directionRefs.current[index]).applyAxisAngle(rotationAxis, angle * Math.PI / 180);
    });
  }, [bloodProperties, settings]);
  return /* @__PURE__ */ jsx(Fragment, { children: bloodProperties.map((prop, index) => {
    const edge = prop.edge;
    const lineThickness = 1e-3 * settings.planeSize;
    const geometry = new THREE.TubeGeometry(
      new THREE.LineCurve3(edge.start, edge.end),
      20,
      lineThickness,
      8,
      false
    );
    const arrowSize = lineThickness * 8;
    return /* @__PURE__ */ jsxs("group", { children: [
      /* @__PURE__ */ jsx(
        "mesh",
        {
          ref: (el) => lineRefs.current[index] = el,
          geometry,
          children: /* @__PURE__ */ jsx("meshBasicMaterial", { color: "red" })
        }
      ),
      /* @__PURE__ */ jsx(
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
function BloodPoint() {
  const { bloodProperties, settings } = useContext(AppContext);
  const dotRefs = useRef([]);
  const textRefs = useRef([]);
  useEffect(() => {
    bloodProperties.forEach((prop, index) => {
      if (dotRefs.current[index]) {
        dotRefs.current[index].position.copy(prop.edge.start);
      }
    });
  }, [bloodProperties, settings.planeSize]);
  useFrame(({ camera }) => {
    bloodProperties.forEach((_, index) => {
      if (textRefs.current[index]) {
        textRefs.current[index].lookAt(camera.position);
      }
    });
  });
  return /* @__PURE__ */ jsx(Fragment, { children: bloodProperties.map((prop, index) => {
    return /* @__PURE__ */ jsxs("group", { children: [
      /* @__PURE__ */ jsxs("mesh", { ref: (el) => dotRefs.current[index] = el, children: [
        /* @__PURE__ */ jsx("sphereGeometry", { args: [4e-3 * settings.planeSize, 12, 12] }),
        /* @__PURE__ */ jsx("meshBasicMaterial", { color: "red" })
      ] }),
      /* @__PURE__ */ jsx(
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
    ] }, index);
  }) });
}
function AOC() {
  const { bloodProperties, settings } = useContext(AppContext);
  const { center, setCenter, impact, vicHeight } = useContext(CrimeSceneContext);
  const textRef = useRef(null);
  const centerRef = useRef(null);
  const ringRef = useRef(null);
  const [r, setR] = useState(0);
  const [innerRadius, setInnerRadius] = useState(0);
  const checkCollisions = ({
    circleSphere
  }) => {
    let flag = true;
    bloodProperties.forEach((prop) => {
      const closestPoint = new THREE.Vector3();
      prop.edge.closestPointToPoint(circleSphere.center, true, closestPoint);
      if (closestPoint.distanceTo(circleSphere.center) > circleSphere.radius) {
        flag = false;
        return;
      }
    });
    return flag;
  };
  useEffect(() => {
    const planeSize = settings.planeSize;
    let lr = -planeSize / 2, rr = -lr, resX = 0, resY = 0, resR = 0;
    if (bloodProperties.length != 0) {
      while (lr < rr) {
        let x = -planeSize / 2;
        let mr = (lr + rr) / 2;
        let flag = false;
        while (x < planeSize / 2) {
          let y = -planeSize / 2;
          while (y < planeSize / 2) {
            const circleSphere = new THREE.Sphere(
              new THREE.Vector3(x, 0, y),
              mr
            );
            if (checkCollisions({ circleSphere })) {
              flag = true;
              resX = x;
              resY = y;
              resR = mr;
            }
            y += planeSize / 20;
          }
          x += planeSize / 20;
        }
        flag ? rr = mr : lr = mr + planeSize / 40;
      }
    }
    setCenter([resX, resY]);
    const safeR = Math.max(r, 1);
    setInnerRadius(Math.max(1 - 1 / (2.5 * safeR), 0.01));
    setR(lr);
    if (ringRef.current) {
      ringRef.current.position.set(resX, 0, resY);
      ringRef.current.scale.set(resR, resR, 1);
      ringRef.current.rotation.x = Math.PI / 2;
    }
  }, [bloodProperties, settings]);
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
    if (centerRef.current) {
      centerRef.current.lookAt(camera.position);
    }
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("mesh", { ref: ringRef, children: [
      /* @__PURE__ */ jsx("ringGeometry", { args: [innerRadius, 1, 64] }),
      /* @__PURE__ */ jsx(
        "meshBasicMaterial",
        {
          color: "white",
          opacity: 0.9,
          transparent: true,
          side: THREE.DoubleSide
        }
      )
    ] }),
    bloodProperties.length != 0 && r >= 0.25 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        Text,
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
      /* @__PURE__ */ jsxs(
        Text,
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
function Axis() {
  const { settings } = useContext(AppContext);
  const createAxisLine = (start, end, color) => {
    const material = new THREE.LineBasicMaterial({ color });
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    return new THREE.Line(geometry, material);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "primitive",
      {
        object: createAxisLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, settings.planeSize, 0),
          "red"
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "primitive",
      {
        object: createAxisLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, -settings.planeSize),
          "green"
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "primitive",
      {
        object: createAxisLine(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(settings.planeSize, 0, 0),
          "blue"
        )
      }
    ),
    /* @__PURE__ */ jsx(
      Text,
      {
        position: [settings.planeSize * 1.02, 0, 0],
        fontSize: settings.planeSize / 25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "X"
      }
    ),
    /* @__PURE__ */ jsx(
      Text,
      {
        position: [0, 0, -settings.planeSize * 1.02],
        fontSize: settings.planeSize / 25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "Y"
      }
    ),
    /* @__PURE__ */ jsx(
      Text,
      {
        position: [0, settings.planeSize * 1.02, 0],
        fontSize: settings.planeSize / 25,
        color: "white",
        anchorX: "center",
        anchorY: "middle",
        children: "Z"
      }
    ),
    /* @__PURE__ */ jsx(
      Text,
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
function Scene() {
  const { settings } = useContext(AppContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PerspectiveCamera,
      {
        makeDefault: true,
        position: [
          settings.planeSize + settings.planeSize / 4,
          settings.planeSize / 2,
          -settings.planeSize - settings.planeSize / 4
        ],
        fov: 25
      }
    ),
    /* @__PURE__ */ jsx(
      OrbitControls,
      {
        target: [settings.planeSize / 2, 0, -settings.planeSize / 2]
      }
    ),
    /* @__PURE__ */ jsx("ambientLight", { intensity: 0.5 }),
    /* @__PURE__ */ jsx("directionalLight", { position: [3, 3, -3] }),
    /* @__PURE__ */ jsx(
      "gridHelper",
      {
        args: [settings.planeSize, 10],
        position: [settings.planeSize / 2, 0, -settings.planeSize / 2]
      }
    ),
    /* @__PURE__ */ jsx(
      "gridHelper",
      {
        args: [settings.planeSize, 10],
        rotation: [Math.PI / 2, 0, 0],
        position: [settings.planeSize / 2, settings.planeSize / 2, 0]
      }
    ),
    /* @__PURE__ */ jsx(
      "gridHelper",
      {
        args: [settings.planeSize, 10],
        rotation: [0, 0, Math.PI / 2],
        position: [0, settings.planeSize / 2, -settings.planeSize / 2]
      }
    )
  ] });
}
function Crimescene() {
  const { bloodProperties, settings, setBloodHeight } = useContext(AppContext);
  const [trajectories, setTrajectories] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [vicHeight, setVicHeight] = useState(0);
  const [impact, setImpact] = useState(0);
  useEffect(() => {
    let sumh = 0;
    let maxh = 0;
    let tempBloodHeight = [];
    bloodProperties.map((prop) => {
      let { x, y, AOI } = prop;
      const di = Math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2);
      const tan = Math.tan(AOI * Math.PI / 180);
      const temp = settings.motion == "Straight" ? di * tan : di ** 2 * tan / (3 * di - 1);
      sumh += temp;
      maxh = Math.max(maxh, temp);
      tempBloodHeight.push(temp);
    });
    setVicHeight(maxh);
    setImpact(sumh / bloodProperties.length);
    setBloodHeight(tempBloodHeight);
    setTrajectories(
      bloodProperties.map(
        (prop) => computeTrajectory(prop, center, settings.motion)
      )
    );
  }, [bloodProperties, center, settings, vicHeight]);
  return /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsxs(Canvas, { children: [
        /* @__PURE__ */ jsx(Scene, {}),
        /* @__PURE__ */ jsx(Axis, {}),
        /* @__PURE__ */ jsx(BloodPoint, {}),
        settings.showTrajectory && /* @__PURE__ */ jsx(BloodProjectile, {}),
        settings.showSP && /* @__PURE__ */ jsx(BloodStraight, {}),
        settings.showAOC && /* @__PURE__ */ jsx(AOC, {}),
        bloodProperties.length != 0 && /* @__PURE__ */ jsxs("mesh", { position: [center[0], vicHeight / 2, center[1]], children: [
          /* @__PURE__ */ jsx(
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
          /* @__PURE__ */ jsx("meshBasicMaterial", { color: "white", opacity: 1, transparent: true })
        ] }),
        trajectories.map(
          (points, index) => points.length > 0 ? /* @__PURE__ */ jsxs(
            "mesh",
            {
              position: [center[0], points[0].y, center[1]],
              rotation: [Math.PI / 2, 0, 0],
              children: [
                /* @__PURE__ */ jsx("torusGeometry", { args: [settings.planeSize / 100, 0.025, 16, 32] }),
                /* @__PURE__ */ jsx("meshBasicMaterial", { color: "red" })
              ]
            },
            index
          ) : null
        ),
        impact && /* @__PURE__ */ jsxs(
          "mesh",
          {
            position: [center[0], impact, center[1]],
            rotation: [Math.PI / 2, 0, 0],
            children: [
              /* @__PURE__ */ jsx("torusGeometry", { args: [settings.planeSize / 100, 0.025, 16, 32] }),
              /* @__PURE__ */ jsx("meshBasicMaterial", { color: "green" })
            ]
          }
        )
      ] })
    }
  );
}
function TimeSlider() {
  const { time, setTime } = useContext(AppContext);
  const animationRef = useRef();
  const lastUpdateTime = useRef(0);
  const isAnimating = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    const animate = (currentTime) => {
      if (!isAnimating.current) return;
      if (currentTime - lastUpdateTime.current >= 100) {
        const nextTime = time + 1;
        setTime(nextTime >= 100 ? 100 : nextTime);
        lastUpdateTime.current = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    if (isPlaying) {
      isAnimating.current = true;
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(animationRef.current);
      isAnimating.current = false;
    };
  }, [isPlaying, time, setTime]);
  const handleClick = (e) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const sliderWidth = rect.width;
    const newTime = clickX / sliderWidth * 100;
    setTime(newTime);
  };
  const handlePlayStop = () => {
    setIsPlaying((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full h-6 cursor-pointer", onClick: handleClick, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 w-full h-1 bg-gray-500 rounded-full -translate-y-1/2" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute top-1/2 left-0 h-1 bg-gray-200 rounded-full -translate-y-1/2 transition-all",
          style: { width: `${time}%` }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute top-1/2 h-4 w-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 transition-all",
          style: { left: `${time}%` }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setTime(0), children: /* @__PURE__ */ jsx(FaBackward, { size: 24, color: "white" }) }),
      /* @__PURE__ */ jsx("button", { onClick: handlePlayStop, children: isPlaying ? /* @__PURE__ */ jsx(FaPause, { size: 24, color: "white" }) : /* @__PURE__ */ jsx(FaPlay, { size: 24, color: "white" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => setTime(100), children: /* @__PURE__ */ jsx(FaForward, { size: 24, color: "white" }) })
    ] })
  ] });
}
function Selector({
  title,
  choices,
  selectedChoice,
  setSelectedChoice
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "text-gray-200 font-bold", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
      "select",
      {
        value: selectedChoice || "",
        onChange: (e) => setSelectedChoice(e.target.value),
        className: "w-32 p-2 border rounded-md bg-black text-white",
        children: choices.map((choice) => /* @__PURE__ */ jsx("option", { value: choice, children: choice }, choice))
      }
    ) })
  ] });
}
function Tickbox({
  title,
  data,
  setData
}) {
  const handleCheckboxChange = (event) => {
    setData(event.target.checked);
  };
  return /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("label", { className: "flex gap-2 items-center text-white", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "checkbox",
        checked: data,
        onChange: handleCheckboxChange,
        className: "peer hidden"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white rounded-md flex justify-center items-center relative peer-checked:bg-white checked:fill-black" }),
    /* @__PURE__ */ jsx(
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
function Settings() {
  const { settings, setSettings, bloodProperties } = useContext(AppContext);
  const [showTrajectory, setShowTrajectory] = useState(settings.showTrajectory);
  const [showSP, setShowSP] = useState(settings.showSP);
  const [showAOC, setShowAOC] = useState(settings.showAOC);
  const [motion, setMotion] = useState(settings.motion);
  const [material, setMaterial] = useState(settings.material);
  const [planeSize, setPlaneSize] = useState("20");
  useEffect(() => {
    setSettings({
      showTrajectory,
      showSP,
      showAOC,
      motion,
      material,
      planeSize: Number(planeSize)
    });
  }, [showTrajectory, showSP, showAOC, motion, material, planeSize]);
  useEffect(() => {
    let maxSize = 20;
    bloodProperties.forEach((prop) => {
      maxSize = Math.max(maxSize, prop.x, -prop.y);
    });
    setPlaneSize(String(Math.ceil(maxSize / 10) * 10));
  }, [bloodProperties]);
  return /* @__PURE__ */ jsxs("div", { className: "w-full flex rounded-lg justify-between items-center border-2 border-border p-4", children: [
    /* @__PURE__ */ jsx(
      Selector,
      {
        title: "Blood Motion",
        choices: ["Projectile", "Free fall", "Straight"],
        selectedChoice: motion,
        setSelectedChoice: setMotion
      }
    ),
    /* @__PURE__ */ jsx(
      Tickbox,
      {
        title: "Show Blood Motion",
        data: showTrajectory,
        setData: setShowTrajectory
      }
    ),
    /* @__PURE__ */ jsx(Tickbox, { title: "Show Blood Path", data: showSP, setData: setShowSP }),
    /* @__PURE__ */ jsx(Tickbox, { title: "Show AOC", data: showAOC, setData: setShowAOC }),
    /* @__PURE__ */ jsx(
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
function Index() {
  const [settings, setSettings] = useState({
    showTrajectory: true,
    showSP: true,
    showAOC: true,
    motion: "Projectile",
    material: "Paper",
    planeSize: 20
  });
  const [time, setTime] = useState(0);
  const [focusBlood, setFocusBlood] = useState(-1);
  const [bloodHeight, setBloodHeight] = useState([]);
  const [bloodProperties, setBloodProperties] = useState(
    []
  );
  return /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsx("div", { className: "w-full max-h-screen h-screen flex flex-col items-center justify-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full h-full gap-4 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx(Settings, {}),
        /* @__PURE__ */ jsxs("div", { className: "w-full h-[64vh] grid grid-cols-10 gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-3 h-full overflow-y-auto", children: /* @__PURE__ */ jsx(BloodContainer, {}) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-7 border-2 border-border rounded-lg", children: focusBlood != -1 ? /* @__PURE__ */ jsx(BloodProperties, { bloodPropertie: bloodProperties[focusBlood] }) : /* @__PURE__ */ jsx(Crimescene, {}) })
        ] }),
        focusBlood == -1 && /* @__PURE__ */ jsx(TimeSlider, {})
      ] }) })
    }
  );
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-xaTYtykK.js", "imports": ["/assets/jsx-runtime-CSwQo8vN.js", "/assets/components-DcqcD3h8.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D8zyzWX9.js", "imports": ["/assets/jsx-runtime-CSwQo8vN.js", "/assets/components-DcqcD3h8.js"], "css": ["/assets/root-BJXDopan.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DZb37zCR.js", "imports": ["/assets/jsx-runtime-CSwQo8vN.js"], "css": [] } }, "url": "/assets/manifest-6c242481.js", "version": "6c242481" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
