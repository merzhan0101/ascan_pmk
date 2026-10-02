import { useState, useEffect, useMemo } from "react";
import Dropdown from "./components/Dropdown";
import SearchBar from "./components/SearchBar";
import GridButton from "./components/GridButton";
import styles from "./App.module.css";
import Modal from "./components/Modal";
import ToggleSwitch from "./components/ToggleSwitch";
import SearchableDropdown from "./components/SearchableDropdown";

const fetchData = async () => {
  try {
    const response = await fetch("/ascan");
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);

    return { batch_number_kpc: [], batch_number_6pr: [], malting_for_kpc: [], malting_for_6pr: [] };
  }
};

const sendBatchData = async (place, batchNumber, maltingNumber, setDataPr6LIne, setDataOneLIne, setDataTwoLIne) => {
  if (!batchNumber && !maltingNumber) return;

  try {
    const response = await fetch("http://10.110.7.253:3001/api/wheel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place, batch_number: batchNumber, malting: maltingNumber }),
    });

    if (!response.ok) throw new Error("Ошибка при отправке данных");

    const allNumbers = await response.json();
    console.log(allNumbers)

    setDataPr6LIne(allNumbers.pr_6 || []);
    setDataOneLIne(allNumbers.line_one || []);
    setDataTwoLIne(allNumbers.line_two || []);
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Ошибка отправки данных!");
  }
};

const MainApp = () => {
  const [selectedSection, setSelectedSection] = useState("КПЦ");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [batchData, setBatchData] = useState({ batch_number_kpc: [], batch_number_6pr: [] });
  const [maltingData, setMaltingData] = useState({ malting_for_kpc: [], malting_for_6pr: [] });

  const [dataOneLine, setDataOneLIne] = useState({});
  const [dataTwoLine, setDataTwoLIne] = useState({});
  const [dataPr6Line, setDataPr6LIne] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWheel, setSelectedWheel] = useState(null);
  const [wheelInfo, setWheelInfo] = useState(null);
  const [isToggled, setIsToggled] = useState(false);

  const handleWheelClick = async (wheelNumber, place, line, id_wheel) => {

    let result = {};
    console.log(wheelNumber)
    console.log(id_wheel)
    if (line === 1) {
      result = {
        hot_number: dataOneLine.hot_number?.[id_wheel] || null,
        malting_namber: dataOneLine.malting_namber?.[id_wheel] || null,
        batch_number: selectedBatch,
        task_number: dataOneLine.task_number?.[id_wheel] || null,
        date_time: dataOneLine.date_time?.[id_wheel] || null,
        path_img: dataOneLine.path_img?.[id_wheel] || null,
      };

    } else if (line === 2) {
      result = {
        hot_number: dataTwoLine.hot_number?.[id_wheel] || null,
        malting_namber: dataTwoLine.malting_namber?.[id_wheel] || null,
        batch_number: selectedBatch,
        task_number: dataTwoLine.task_number?.[id_wheel] || null,
        date_time: dataTwoLine.date_time?.[id_wheel] || null,
        path_img: dataTwoLine.path_img?.[id_wheel] || null,

      };
    } else {
      result = {
        hot_number: dataPr6Line.hot_number?.[id_wheel] || null,
        malting_namber: dataPr6Line.malting_namber?.[id_wheel] || null,
        batch_number: selectedBatch,
        task_number: dataPr6Line.task_number?.[id_wheel] || null,
        date_time: dataPr6Line.date_time?.[id_wheel] || null,
        path_img: dataPr6Line.path_img?.[id_wheel] || null,
      };
    }
    console.log(result.path_img)

    setSelectedWheel(wheelNumber);
    setWheelInfo(result);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchData().then((data) => {
      setBatchData({
        batch_number_kpc: data.batch_number_kpc,
        batch_number_6pr: data.batch_number_6pr,
      });
      setMaltingData({
        malting_for_kpc: data.malting_for_kpc,
        malting_for_6pr: data.malting_for_6pr,
      });
    });
  }, [selectedSection, isToggled]);

  useEffect(() => {
    if (!selectedBatch) return;

    if (!isToggled) {
      sendBatchData(selectedSection, selectedBatch, null, setDataPr6LIne, setDataOneLIne, setDataTwoLIne);
    } else {
      sendBatchData(selectedSection, null, selectedBatch, setDataPr6LIne, setDataOneLIne, setDataTwoLIne);
    }
  }, [selectedBatch, selectedSection, isToggled]);

  useEffect(() => {
    setSelectedBatch("");
  }, [isToggled, selectedSection]);

  const displayData = useMemo(() => {
    return isToggled
      ? selectedSection === 'КПЦ'
        ? maltingData.malting_for_kpc
        : maltingData.malting_for_6pr
      : selectedSection === 'КПЦ'
        ? batchData.batch_number_kpc
        : batchData.batch_number_6pr;
  }, [isToggled, selectedSection, batchData, maltingData])

  const filteredNumbers = searchTerm
    ? (dataPr6Line.hot_number || [])
      .map((num, originalIndex) => ({ num, originalIndex }))
      .filter(({ num }) => num?.toString().includes(searchTerm))
    : (dataPr6Line.hot_number || []).map((num, originalIndex) => ({ num, originalIndex }));

  const filteredLineOne = searchTerm
    ? (dataOneLine.hot_number || [])
      .map((num, originalIndex) => ({ num, originalIndex }))
      .filter(({ num }) => num?.toString().includes(searchTerm))
    : (dataOneLine.hot_number || []).map((num, originalIndex) => ({ num, originalIndex }));

  const filteredLineTwo = searchTerm
    ? (dataTwoLine.hot_number || [])
      .map((num, originalIndex) => ({ num, originalIndex }))
      .filter(({ num }) => num?.toString().includes(searchTerm))
    : (dataTwoLine.hot_number || []).map((num, originalIndex) => ({ num, originalIndex }));

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: "center", marginBottom: "-10px" }}>
        Колесопрокатный цех (КПЦ)
      </h1>
      <p style={{ fontSize: "20px" }}>
        Лаборатория неразрушающего контроля
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <ToggleSwitch
          label="Включить"
          isOn={isToggled}
          handleToggle={() => {
            setIsToggled(!isToggled);
            setSelectedBatch("");
          }}
        />
      </div>
      {/* Выпадающий список для выбора секции */}
	  
		<div style={{ textAlign: "center", margin: "20px 0" }}>
			<button
			  onClick={() => {
				window.location.href = "http://10.110.7.253/";
			  }}
			  style={{
				padding: "10px 20px",
				fontSize: "16px",
				cursor: "pointer",
				borderRadius: "8px",
				border: "none",
				marginLeft: "44vw",
				marginTop: "-138px", 
				position: "absolute",
				backgroundColor: "#d9534f",
				color: "#fff",
			  }}
			>
			  Выйти
			</button>
		  </div>

      <div className={styles.searchContainer}>
        <Dropdown
          options={["КПЦ", "Пролет №6"]}
          selected={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        />
        <SearchableDropdown
          value={selectedBatch}
          options={displayData}
          placeholder="Введите партию"
          onSelect={(value) => setSelectedBatch(value)}
        />
        <SearchBar
          placeholder={selectedSection === "КПЦ" ? "Поиск по КПЦ" : "Поиск по Пролету №6"}
          onSearch={setSearchTerm}
        />
      </div>



      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>Информация о колесе</h2>
          <p><strong>Номер колеса:</strong> {selectedWheel}</p>
          {wheelInfo && (
            <>
              <div style={{ display: "flex", gap: "30px", justifyContent: "space-between", marginBottom: "20px" }}>
                <p><strong>Горячая маркировка:</strong> {wheelInfo.hot_number}</p>
                <p><strong>Плавка:</strong> {wheelInfo.malting_namber}</p>
                <p><strong>Партия:</strong> {wheelInfo.batch_number}</p>
                <p><strong>Задание:</strong> {wheelInfo.task_number}</p>
                <p><strong>Дата и Время:</strong> {wheelInfo.date_time}</p>
              </div>
              {wheelInfo.path_img && (
                <img
                  src={`${wheelInfo.path_img.replace("D:\\SHARE\\LNK", "").replace(/\\/g, "/")}`}
                  alt="Wheel"
                  style={{ width: "400%", maxWidth: "800px", marginTop: "10px", borderRadius: "8px" }}
                />
              )}
            </>
          )}
        </Modal>
      )}

      <div className={styles.gridContainer}>
        {selectedSection === "КПЦ" ? (
          <>
            <div className={styles.line}>
              <h3>Линия №1</h3>
              <div className={styles.grid}>
                {filteredLineOne.map(({ num, originalIndex }) => (
                  <GridButton
                    key={`l1-${originalIndex}`}
                    number={num}
                    onClick={() => handleWheelClick(num, selectedSection, 1, originalIndex)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.line}>
              <h3>Линия №2</h3>
              <div className={styles.grid}>
                {filteredLineTwo.map(({ num, originalIndex }) => (
                  <GridButton
                    key={`l1-${originalIndex}`}
                    number={num}
                    onClick={() => handleWheelClick(num, selectedSection, 2, originalIndex)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h3>Пролет №6</h3>
            <div className={styles.sectionWrapper}>
              <div className={styles.grid}>
                {filteredNumbers.map(({ num, originalIndex }) => (
                  <GridButton
                    key={`l1-${originalIndex}`}
                    number={num}
                    onClick={() => handleWheelClick(num, selectedSection, null, originalIndex)}
                  />
                ))}
                {filteredNumbers.length === 0 &&
                  <p className={styles.noResults}>Ничего не найдено</p>
                }
              </div>
            </div>
          </>
        )}
      </div>

    </div>

  );
};

export default MainApp;
