export type Picked = {
    uri: string;        // file://...
    fileName?: string;  // IMG_0111.heic
    mimeType?: string;  // image/heic
  };

export type PresignedItem = {
  image_id: number;
  upload_url: string;   // 여기에 PUT
  final_url: string;    // 업로드 끝난 뒤 화면에서 사용 가능 (CDN)
  filename: string;     // S3 키(백엔드 DB에 저장됨) ex) "5/1/uuid.jpg"
  original_url?: string // 백이 넣어줄 수도 있음(스키마상 char)
};