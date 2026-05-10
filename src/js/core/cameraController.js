export async function startCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });

  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
}
