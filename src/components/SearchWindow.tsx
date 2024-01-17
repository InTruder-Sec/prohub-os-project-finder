import { useCallback, useContext, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { debounce } from "lodash";
import { CommandLoading } from "cmdk";
import { File } from "lucide-react";
import { ENDPOINT, globalToken } from "@/App";

const SearchWindow = (props) => {
  const token = useContext(globalToken);

  const [searchFilters, setsearchFilters] = useState({
    location: true,
    date: true,
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(results);

  const onCheckedChange = (filterName) => {
    return (checked) => {
      setsearchFilters((prev) => ({
        ...prev,
        [filterName]: checked,
      }));
    };
  };

  const sendQuery = useCallback(
    async (query: string): Promise<any> => {
      try {
        console.log(query);
        if (query === "") {
          setResults([]);
          return;
        }
        setLoading(true);
        await fetch(
          `${ENDPOINT}/api/user/search?q=${query}&latest=${searchFilters.date}&location=${searchFilters.location}&token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setResults(data.data);
            setLoading(false);
          });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
    [query]
  );

  useEffect(() => {
    const debouncedSearch = debounce(sendQuery, 500);
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query, sendQuery]);

  return (
    <CommandDialog open={props.SearchState} onOpenChange={props.setSearchState}>
      <CommandInput
        placeholder="Type a command or search..."
        onValueChange={(value) => {
          setQuery(value);
        }}
      />
      <CommandList>
        <CommandSeparator />
        <div className="p-2 text-sm">Filters</div>
        <div className="flex py-2 px-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="location"
              checked={searchFilters.location}
              onCheckedChange={onCheckedChange("location")}
            />
            <label className="text-sm">Location</label>
          </div>
          <div className="flex items-center space-x-2 px-4">
            <Switch
              id="date"
              checked={searchFilters.date}
              onCheckedChange={onCheckedChange("date")}
            />
            <label className="text-sm">Latest</label>
          </div>
        </div>
        <CommandSeparator />
        {loading && (
          <CommandLoading>
            <div className="p-4">Running 416HP engine…</div>
          </CommandLoading>
        )}
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="">
          {results.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document.repoName} ${document.repoTags}`}
              title={document.repoName}
              onSelect={() => {
                // redirect to repo link in new tab
                window.open(document.repoLink, "_blank");
              }}
            >
              <File className="mr-2 h-4 w-4" />

              <span>{document.repoName}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchWindow;
