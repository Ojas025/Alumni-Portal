import { UserConnectionCard  } from "./UserConnectionCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

export const Connections = () => {
	const connections = useSelector((state: RootState) => state.user.user?.connections);	
    
	return (
		<div className="dark:bg-[#151515] bg-white  p-4 rounded-md dark:shadow-none shadow-xl">

			<h3 className="text-lg font-semibold mb-3">Connections</h3>

			{
				connections?.length ?
				<div className="space-y-4">
					{
						connections?.map((connection, index) => (
							<UserConnectionCard key={index}
								_id={connection._id}
								firstName={connection.firstName}
								lastName={connection.lastName}
								profileImageURL={connection.profileImageURL}
								role={connection.role}
							/>
						))
					}
				</div>     
				: <p className="text-sm text-gray-500 dark:text-gray-300">No connections found</p>   
			}

		</div>
	)
}

