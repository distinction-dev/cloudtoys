import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaRegFile, FaRegFolder } from 'react-icons/fa';
import { Breadcrumbs } from '@primer/react';
import { formatBytes } from '../../infrastructure/utils/formatBytes';
import { FiBox } from 'react-icons/fi';

function ObjectDetail() {
  const { bucketName, '*': objectPrefix } = useParams();
  const navigate = useNavigate();
  const [objects, setObjects] = useState([]);
  const location = useLocation();

  let finalPrefix;
  if (objectPrefix?.includes(',')) {
    finalPrefix = objectPrefix.split(',').join('/') + '/';
  } else {
    finalPrefix = objectPrefix;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);
  const buckets = location?.state?.bucketList;

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
            size: 0,
          })),
          ...(objects.Contents || [])
            .filter((content) => content.Size > 0) // Filter contents with size greater than 0
            .map((content) => ({
              name: content.Key,
              type: content.Key.endsWith('/') ? 'folder' : 'file',
              size: content.Size,
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
    <div className="bg-white flex items-start">
      <section className="flex-[0.3] mt-28 ml-6 p-2">
        {buckets?.map((bucket: string, index: number) => {
          return (
            <button
              className={`${bucket === bucketName ? 'bg-[#E8EDF5]' : 'bg-white'} w-full min-h-[40px] mt-2 flex items-center`}
              key={index}
            >
              <FiBox color="black" size={24} className="mr-2" />
              <Link
                to={`/Buckets/${bucket}`}
                state={{ bucketList: buckets }}
                className="font-mono text-black flex-grow w-[200px] truncate"
              >
                {bucket}
              </Link>
            </button>
          );
        })}
      </section>

      <main className="bg-white w-[50%] top-0 sticky flex-grow">
        <section className=" flex-1 p-10">
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
          <h1 className="text-black font-mono font-bold text-[24px] mt-5">
            {pathnames[pathnames.length - 1]}
          </h1>
          <table className="block border border-[#D1DEE5] rounded-lg mt-2">
            <thead className="block">
              <tr className=" flex justify-between border-b border-[#D1DEE5]">
                <th className="px-4 py-2 text-left text-black  text-sm font-bold leading-normal font-mono w-[200px]">
                  Name
                </th>
                <th className="px-0 py-2 text-black text-sm font-bold leading-normal font-mono  w-[90px] text-left">
                  Type
                </th>
                <th className="px-0 py-2 text-left text-black  text-sm font-bold leading-normal font-mono w-[90px]">
                  Size
                </th>
              </tr>
            </thead>
            <tbody className="block">
              {objects.length > 0 ? (
                objects.map(
                  (
                    object: { name: string; type: string; size: number },
                    index
                  ) => {
                    const parts = object.name.split('/').filter(Boolean);
                    const isFolder = object.type === 'folder';
                    const extension = isFolder
                      ? ''
                      : parts[parts.length - 1].split('.').pop();
                    const size = object?.size;

                    return (
                      <tr
                        key={index}
                        className="flex items-center px-2 border-b border-[#D1DEE5] last:border-b-0 justify-between"
                      >
                        <td className="text-sm font-medium text-[#0D171C] font-mono w-[200px]">
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
                              <span className="ml-2 text-black font-bold font-mono">
                                {parts[parts.length - 1]}
                              </span>
                            </tr>
                          )}
                        </td>
                        <td className="text-sm font-medium text-[#0D171C] font-mono  w-[100px] text-left">
                          {isFolder ? 'Folder' : `.${extension}`}
                        </td>
                        <td className="text-sm font-medium text-[#0D171C] font-mono w-[80px]">
                          {isFolder ? '-' : formatBytes(size)}
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <div className="text-center py-5 text-black font-mono">
                  No objects found in this folder.
                </div>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default ObjectDetail;
