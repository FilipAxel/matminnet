interface VideoProps {
  video: string;
}

const Video: React.FC<VideoProps> = ({ video }) => {
  return (
    <div className="aspect-h-9 aspect-w-16 m-5 flex justify-center">
      <iframe
        src={video}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Video;
