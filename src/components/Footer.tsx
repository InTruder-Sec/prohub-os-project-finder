function Footer() {
  return (
    <div className="flex w-100 bg-white dark:bg-zinc-900 px-20 py-6 justify-between">
      <div className="font-bold text-2xl text-black dark:text-white mt-2">
        ProHub
      </div>
      <div className="flex">
        <div className="text-sm text-black dark:text-white mt-2 p-2">
          © 2021 ProHub, Inc. All rights reserved
        </div>

        <div className="text-sm text-black dark:text-white mt-2 p-2">
          | Privacy Policy
        </div>

        <div className="text-sm text-black dark:text-white mt-2 p-2">
          | Terms of Service
        </div>
      </div>
    </div>
  );
}

export default Footer;
