window.PHYHOI_CONFIG = {
  sampleManifest: "./data/samples.json",
  submissionEndpoint: "",
  studyDesign: {
    categories: 50,
    samplesPerMethodCategory: 2,
    totalVideos: 300,
    methods: [
      { id: "ltx23", label: "LTX-2.3", targetVideos: 100, status: "ready" },
      {
        id: "longcat_video_avatar",
        label: "LongCat-Video-Avatar",
        targetVideos: 100,
        status: "placeholder",
      },
      {
        id: "interactavatar",
        label: "InteractAvatar",
        targetVideos: 100,
        status: "placeholder",
      },
    ],
  },
};
