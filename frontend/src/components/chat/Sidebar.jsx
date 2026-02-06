import SiderbarHeader from './siderbar/SiderbarHeader'
import { useChatStore } from '../../store/useChatStore'
import UserBtn from '../UserBtn'
import SidebarSkeleton from '../skeleton/SidebarSkeleton'
import { useAuthStore } from '../../store/useAuthStore'

const Sidebar = () => {
  const { users, isUsersLoading, isShowOnline } = useChatStore()
  const { onlineUsers } = useAuthStore()

  return (
    <div className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <SiderbarHeader />

      <div className="flex flex-col">
        {isUsersLoading ? (
          <SidebarSkeleton />
        ) : (
          <UserBtn filteredUsers={isShowOnline ? onlineUsers : users} />
        )}
        {/* <UserBtn filteredUsers={users} */}
      </div>
    </div>
  )
}

export default Sidebar
