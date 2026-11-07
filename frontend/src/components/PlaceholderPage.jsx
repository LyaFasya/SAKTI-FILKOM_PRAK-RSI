import PageHeader from "./PageHeader.jsx";

// Halaman sementara untuk UI yang belum dikerjakan.
// Ganti seluruh isi file halaman dengan implementasi dari Figma.
export default function PlaceholderPage({ judul, uiId, useCase }) {
  return (
    <>
      <PageHeader judul={judul} />
      <div className="kartu">
        <p>Halaman ini belum dikerjakan.</p>
        <p className="teks-redup">
          {uiId && <>UI: {uiId}</>}
          {uiId && useCase && " | "}
          {useCase && <>Use case: {useCase}</>}
        </p>
      </div>
    </>
  );
}
