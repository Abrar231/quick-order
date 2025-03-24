import React, { useRef } from 'react';

function FileUploadButton({setProducts}) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        try {
          const jsonData = await readFileAndParse(file);
          const response = await uploadJsonData(jsonData); // Wait for upload to finish
          if(response.success){
            setProducts(response.data);
          }
        } catch (error) {
          // Handle errors from readFileAndParse or uploadJsonData
          console.error("error during file processing", error);
        }
      } else {
        alert('Please select a valid JSON file.');
      }
    }
  };

  async function readFileAndParse(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          resolve(jsonData); // Resolve the promise with jsonData
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file.');
          reject(error); // Reject the promise with the error
        }
      };
  
      reader.onerror = (error) => {
        reject(error); // Reject if there's a read error
      };
  
      reader.readAsText(file);
    });
  }

  const uploadJsonData = async (jsonData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/product-list`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
      const jsonResponse = await response.json();
      if(jsonResponse.success){
        console.log('File uploaded successfully!');
      } else {
        console.error('File upload failed.');
      }
      return jsonResponse;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <button className='bg-black text-white font-bold rounded-lg px-5 py-3' onClick={handleButtonClick}>Import Product Data</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUploadButton;