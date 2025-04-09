"use client";
export const runtime = "edge";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const SpaceTravel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.2 });

    const starsVertices = [];
    for (let i = 0; i < (mountRef.current.clientWidth * mountRef.current.clientHeight / 200); i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = Math.random() * 2000 - 1000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 1;
    const speedFactor = 20;

    const animate = () => {
      requestAnimationFrame(animate);
      const positions = starsGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += speedFactor;
        if (positions[i + 2] > 1000) {
          positions[i + 2] = -1000;
        }
      }
      starsGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    const addTextParticles = (text: string, delay: number, stayDuration: number) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 2048;
      canvas.height = 2048;
      context.font = "Bold 100px Consolas, monospace, 'Courier New'";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const lines = text.split("\n");

      let maxWidth = 0;
      lines.forEach(line => {
        const metrics = context.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width);
      });

      const lineHeight = 100;
      lines.forEach((line, index) => {
        const y = canvas.height / 2 + (index - (lines.length - 1) / 2) * lineHeight;
        context.fillText(line, canvas.width / 2, y);
      });

      const textureData = context.getImageData(0, 0, 2048, 2048);
      const particles = [];
      const particleDelays = [];

      const validPixels = [];
      for (let y = 0; y < 2048; y += 1) {
        for (let x = 0; x < 2048; x += 1) {
          if (textureData.data[(y * 2048 + x) * 4] > 128) {
            validPixels.push([x, y]);
          }
        }
      }

      for (let i = 0; i < (mountRef.current.clientWidth * mountRef.current.clientHeight / 200); i++) {
        if (validPixels.length > 0) {
          const index = Math.floor(Math.random() * validPixels.length);
          const [x, y] = validPixels[index];
          particles.push(
            (x - 1024) / 512,
            (1024 - y) / 512,
            -1000
          );
          particleDelays.push(Math.random() * 0.5);
          validPixels.splice(index, 1);
        }
      }

      const textGeometry = new THREE.BufferGeometry();
      textGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particles, 3));
      const textMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.2 });
      const textMesh = new THREE.Points(textGeometry, textMaterial);

      const updateTextSize = () => {
        const aspectRatio = mountRef.current.clientWidth / mountRef.current.clientHeight;
        const vFOV = THREE.MathUtils.degToRad(camera.fov);
        const height = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z * 200);
        const width = height * aspectRatio;

        const textWidth = maxWidth / 512;
        const textHeight = (lines.length * lineHeight) / 512;

        const scaleX = width * 0.9 / textWidth;
        const scaleY = height * 0.9 / textHeight;
        const scale = Math.min(scaleX, scaleY);

        textMesh.scale.set(scale, scale, 1);
      };

      const animateText = () => {
        scene.add(textMesh);
        updateTextSize();

        const positions = textGeometry.attributes.position.array;
        let particlesArrived = 0;
        let particlesLeft = 0;

        const animate = () => {
          for (let i = 0; i < positions.length; i += 3) {
            if (positions[i + 2] < -200 && particleDelays[i / 3] <= 0) {
              positions[i + 2] += speedFactor;
              if (positions[i + 2] >= -200) {
                positions[i + 2] = -200;
                particlesArrived++;
              }
            } else {
              particleDelays[i / 3] -= 0.005;
            }
          }

          if (particlesArrived === particles.length / 3) {
            setTimeout(() => {
              const exitAnimation = setInterval(() => {
                for (let i = 0; i < positions.length; i += 3) {
                  if (positions[i + 2] < 100 && Math.random() < 0.05) {
                    positions[i + 2] += speedFactor;
                    if (positions[i + 2] >= 100) {
                      particlesLeft++;
                    }
                  }
                }
                textGeometry.attributes.position.needsUpdate = true;

                if (particlesLeft === particles.length / 3) {
                  clearInterval(exitAnimation);
                  scene.remove(textMesh);
                }
              }, 16);
            }, stayDuration * 1000);
          }

          textGeometry.attributes.position.needsUpdate = true;
          requestAnimationFrame(animate);
        };

        setTimeout(animate, delay * 1000);
      };

      animateText();
      window.addEventListener("resize", updateTextSize);
    };

    addTextParticles("Welcome to s0ma.me", 0, 0.5);
    addTextParticles("Hello,               \nI'm                  ", 4, 8.5);
    addTextParticles("                     \n    Web Developer    ", 4, 0.5);
    addTextParticles("                     \n    Backend Developer", 8, 0.5);
    addTextParticles("                     \n    ML Engineer      ", 12, 0.5);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100dvw", height: "100dvh" }} />;
};

export default function Home() {
  return (
    <main>
      <SpaceTravel />
    </main>
  );
};