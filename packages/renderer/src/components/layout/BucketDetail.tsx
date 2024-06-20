import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaRegFolder, FaFile } from 'react-icons/fa';

function BucketDetail() {
  const { bucketName } = useParams();
  const navigate = useNavigate();
  const [objects, setObjects] = useState([]);

  const fetchObjects = useCallback(async (bucketName, prefix) => {
    try {
      const response = await window.electronApi.invokeListS3Objects(
        bucketName,
        prefix
      );

      const categorizedObjects = [
        ...(response.CommonPrefixes || []).map((prefix) => ({
          name: prefix.Prefix,
          type: 'folder',
        })),
        ...(response.Contents || [])
          .filter((content) => content.Size > 0) // Filter contents with size greater than 0
          .map((content) => ({
            name: content.Key,
            type: content.Key.endsWith('/') ? 'folder' : 'file',
          })),
      ];

      setObjects(categorizedObjects);
    } catch (error) {
      console.error('Failed to fetch objects:', error);
    }
  }, []);

  useEffect(() => {
    fetchObjects(bucketName);
  }, [bucketName, fetchObjects]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white flex">
      <section className="flex-[0.3]"></section>
      <section className=" bg-white w-[50%] flex-1 p-10">
        <button
          className="ml-auto block bg-white font-mono font-bold text-black border border-[#D1DEE5] rounded-lg px-4 py-2 text-sm hover:bg-[#F1F5F8] hover:border-[#D1DEE5] transition-colors duration-200 ease-in-out"
          onClick={() => {
            goBack();
          }}
        >
          Back
        </button>
        <table className="block border border-[#D1DEE5] rounded-lg mt-2">
          <thead className="block">
            <tr className=" flex justify-between border-b border-[#D1DEE5]">
              <th className="px-4 py-3 text-left text-black  text-sm font-bold leading-normal font-mono">
                Name
              </th>
              <th className="px-4 py-3 text-left text-black  text-sm font-bold leading-normal font-mono">
                Region
              </th>
            </tr>
          </thead>
          <tbody className="block">
            {objects.length > 0 ? (
              objects.map((object, index) => {
                const parts = object.name.split('/').filter(Boolean);
                const lastPart = parts[parts.length - 1];

                return (
                  <tr
                    key={index}
                    className="flex items-center px-2 border-b border-[#D1DEE5] last:border-b-0"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#0D171C] text-[14px] min-h-[72px] flex items-center">
                      <span>
                        <FaRegFolder color="black" size={20} />
                      </span>
                    </td>
                    <td>
                      {object.type === 'folder' ? (
                        <Link
                          to={`/buckets/${bucketName}/objects/${encodeURIComponent(lastPart)}/`}
                          className="ml-2 font-mono font-bold text-black"
                        >
                          {lastPart}/
                        </Link>
                      ) : (
                        <span className="ml-2 font-mono font-bold text-black">
                          {lastPart}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="text-center py-5 text-black">
                No objects found in this folder.
              </div>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default BucketDetail;
