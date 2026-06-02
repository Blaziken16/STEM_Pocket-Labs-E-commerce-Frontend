import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

type EditProfileModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editName: string;
  setEditName: React.Dispatch<React.SetStateAction<string>>;
  editPremium: boolean;
  setEditPremium: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProfileDetails: () => void;
};

export default function EditProfileModal({
  isOpen,
  setIsOpen,
  editName,
  setEditName,
  editPremium,
  setEditPremium,
  handleSaveProfileDetails,
}: EditProfileModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 z-[110] mx-auto flex max-w-md flex-col gap-4 rounded-3xl border border-stone-100 bg-surface-container-lowest p-6 shadow-2xl md:top-32"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-xl font-black text-stone-950">
                Edit Profile Details
              </h3>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-stone-50"
              >
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-stone-600">
                  Profile Name
                </label>
                <input
                  id="edit-profile-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Alex Playmaker"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-stone-150 bg-stone-50 p-3.5">
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase tracking-wide text-stone-900">
                    Toggle Premium Stars Membership
                  </p>
                  <p className="text-[10px] font-medium text-stone-500">
                    Earn stars badges and custom shipping discounts
                  </p>
                </div>

                <button
                  id="edit-profile-premium-toggle"
                  type="button"
                  onClick={() => setEditPremium(!editPremium)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    editPremium ? "bg-primary" : "bg-stone-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      editPremium ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-xl bg-stone-100 py-2.5 text-center text-xs font-bold text-stone-700 transition-colors hover:bg-stone-200"
                >
                  Cancel
                </button>

                <button
                  id="save-profile-btn"
                  onClick={handleSaveProfileDetails}
                  className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-extrabold text-white shadow transition-all hover:brightness-105"
                >
                  Save Details
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}