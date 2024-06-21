import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaRegFile, FaRegFolder } from 'react-icons/fa';
import { Breadcrumbs } from '@primer/react';

function ObjectDetail() {
  const { bucketName, '*': objectPrefix } = useParams();
  const navigate = useNavigate();
  const [objects, setObjects] = useState([]);
  const location = useLocation();

  let currentFolder = '';

  if (objects[0]?.type === 'file') {
    currentFolder = objects[0].name.split('/')[0];
  } else {
    currentFolder = null;
  }

  let finalPrefix;
  if (objectPrefix?.includes(',')) {
    finalPrefix = objectPrefix.split(',').join('/') + '/';
  } else {
    finalPrefix = objectPrefix;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const fetchObjectDetails = async (
      bucketName: string | undefined,
      finalPrefix: string | undefined
    ) => {
      try {
        const objects = await window.electronApi.invokeListS3Objects(
          bucketName,
          finalPrefix
        );
        const categorizedObjects = [
          ...(objects.CommonPrefixes || []).map((prefix) => ({
            name: prefix.Prefix,
            type: 'folder',
          })),
          ...(objects.Contents || [])
            .filter((content) => content.Size > 0) // Filter contents with size greater than 0
            .map((content) => ({
              name: content.Key,
              type: content.Key.endsWith('/') ? 'folder' : 'file',
            })),
        ];
        setObjects(categorizedObjects);
      } catch (error) {
        console.error('Failed to fetch object details:', error);
      }
    };

    fetchObjectDetails(bucketName, finalPrefix);
  }, [bucketName, objectPrefix]);

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
        {pathnames.length > 0 && (
          <Breadcrumbs>
            {pathnames.map((name, index) => {
              // Adjust the 'to' value for the first Breadcrumb item
              const to =
                index === 0
                  ? '/'
                  : `/${pathnames.slice(0, index + 1).join('/')}/`;

              // Check if the current item is the last one in the array
              const isLast = index === pathnames.length - 1;
              return (
                <Breadcrumbs.Item key={index}>
                  {isLast ? (
                    // Render as span for the last item
                    <span className="font-mono text-black">{name}</span>
                  ) : (
                    // Render as Link for all other items
                    <Link className="font-mono" to={to}>
                      {name}
                    </Link>
                  )}
                </Breadcrumbs.Item>
              );
            })}
          </Breadcrumbs>
        )}
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

                return (
                  <tr
                    key={index}
                    className="flex items-center px-2 border-b border-[#D1DEE5] last:border-b-0"
                  >
                    <td>
                      {object.type === 'folder' ? (
                        <tr className="flex items-center">
                          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-[#0D171C] text-[14px] min-h-[72px] flex items-center">
                            <span>
                              <FaRegFolder color="black" size={20} />
                            </span>
                          </td>
                          <Link
                            to={`/Buckets/${bucketName}/${parts.map((part: string) => encodeURIComponent(part)).join('/')}/`}
                            className="ml-2 font-mono font-bold text-black"
                          >
                            {parts[parts.length - 1]}/
                          </Link>
                        </tr>
                      ) : (
                        <tr className="flex items-center">
                          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-[#0D171C] text-[14px] min-h-[72px] flex items-center">
                            <span>
                              <FaRegFile color="black" size={20} />
                            </span>
                          </td>
                          <span className="ml-2  text-black font-bold font-mono">
                            {parts[parts.length - 1]}
                          </span>
                        </tr>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="text-center py-5 text-black font-mono">
                No objects found in this folder.
              </div>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ObjectDetail;