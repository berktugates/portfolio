import { useTranslation } from "react-i18next";

export default function EducationListItem() {
  const { t } = useTranslation();
  return (
    <>
      <div
        id="list-item"
        className="flex justify-between items-center border p-1.5 mt-1 rounded-xl"
      >
        <div id="logo-name" className="flex items-center gap-1">
          <img
            src="../../public/firatuniversity.png"
            alt="university-logo"
            className="h-8"
          />
          <div id="name-departman">
            <h1 className="font-semibold text-sm"> {t("universityName")}</h1>
            <h3 className="text-xs text-gray-400">{t('universityDepartment')}</h3>
          </div>
        </div>
        <h1 className="text-xs">2020-2025</h1>
      </div>
    </>
  );
}
