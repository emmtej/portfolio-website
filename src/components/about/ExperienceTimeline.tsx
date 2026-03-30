export function ExperienceTimeline() {
  return (
    <ol className="relative space-y-12 before:absolute before:-ms-px before:h-full before:w-px before:bg-gray-100">
      <li className="relative -ms-[0.4375rem] flex items-start gap-6 pl-2">
        <span className="mt-1.5 size-2.5 shrink-0 rounded-full border border-gray-200 bg-white ring-4 ring-white"></span>

        <div className="flex-1">
          <time className="block mb-1 text-xs font-semibold tracking-tight uppercase text-gray-400">
            February 2025
          </time>

          <h3 className="text-base font-semibold text-[#37352f]">Kickoff</h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            officiis tempora ipsum adipisci tenetur sunt quae exercitationem sed
            pariatur porro!
          </p>
        </div>
      </li>

      <li className="relative -ms-[0.4375rem] flex items-start gap-6 pl-2">
        <span className="mt-1.5 size-2.5 shrink-0 rounded-full border border-gray-200 bg-white ring-4 ring-white"></span>

        <div className="flex-1">
          <time className="block mb-1 text-xs font-semibold tracking-tight uppercase text-gray-400">
            March 2025
          </time>

          <h3 className="text-base font-semibold text-[#37352f]">
            First Milestone
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            officiis tempora ipsum adipisci tenetur sunt quae exercitationem sed
            pariatur porro!
          </p>
        </div>
      </li>

      <li className="relative -ms-[0.4375rem] flex items-start gap-6 pl-2">
        <span className="mt-1.5 size-2.5 shrink-0 rounded-full border border-gray-200 bg-white ring-4 ring-white"></span>

        <div className="flex-1">
          <time className="block mb-1 text-xs font-semibold tracking-tight uppercase text-gray-400">
            April 2025
          </time>

          <h3 className="text-base font-semibold text-[#37352f]">Launch</h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            officiis tempora ipsum adipisci tenetur sunt quae exercitationem sed
            pariatur porro!
          </p>
        </div>
      </li>
    </ol>
  );
}
